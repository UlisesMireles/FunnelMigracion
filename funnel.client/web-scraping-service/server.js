const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS más permisiva
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://localhost:3000',   // HTTPS local
      'https://localhost:49834',
      // Agregar más orígenes según necesites
    ];
    
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('No permitido por CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 horas
};

// Configuración de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware adicional para OPTIONS requests (preflight)
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas peticiones desde esta IP'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// ===== FUNCIONES HELPER ANTI-DETECCIÓN =====

// Lista de User Agents rotativos
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0'
];

// Función para obtener User Agent aleatorio
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Función para delay aleatorio (simular comportamiento humano)
function randomDelay(min = 1000, max = 3000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Función para detectar y manejar páginas de bloqueo
function isBlockedPage(url) {
  const blockedPatterns = [
    '/sorry/',
    'captcha',
    'blocked',
    'access-denied',
    'bot-detection',
    'unusual-traffic',
    '/challenge',
    'security-check'
  ];
  
  return blockedPatterns.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
}

// Pool de navegadores para mejor rendimiento
let browserPool = [];
const MAX_BROWSERS = 3;

async function initializeBrowserPool() {
  for (let i = 0; i < MAX_BROWSERS; i++) {
    const browser = await puppeteer.launch({
      headless: "new", // Usar nuevo modo headless para evitar detección
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-blink-features=AutomationControlled', // Evitar detección de automatización
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--window-size=1920,1080' // Tamaño de ventana realista
      ]
    });
    browserPool.push(browser);
  }
  console.log(`Pool de navegadores inicializado con ${MAX_BROWSERS} instancias`);
}

async function getBrowser() {
  if (browserPool.length === 0) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-blink-features=AutomationControlled',
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--window-size=1920,1080'
      ]
    });
    return browser;
  }
  return browserPool.pop();
}

async function releaseBrowser(browser) {
  if (browserPool.length < MAX_BROWSERS) {
    browserPool.push(browser);
  } else {
    await browser.close();
  }
}

// Endpoint para scraping general
app.post('/scrape', async (req, res) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    const { url, selectors, keywords, maxResults = 10, includeImages = false } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL es requerida',
        metadata: {
          url: url || '',
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      });
    }

    console.log(`[${requestId}] Iniciando scraping de: ${url}`);
    
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // ===== CONFIGURACIÓN ANTI-DETECCIÓN =====
    
    // 1. Configurar viewport realista
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 2. Configurar user agent realista y aleatorio
    await page.setUserAgent(getRandomUserAgent());
    
    // 3. Configurar headers adicionales
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    });
    
    // 4. Remover propiedades que indican automatización
    await page.evaluateOnNewDocument(() => {
      // Remover webdriver property
      delete Object.getPrototypeOf(navigator).webdriver;
      
      // Sobrescribir la propiedad webdriver
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Sobrescribir languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['es-ES', 'es', 'en'],
      });
      
      // Sobrescribir plugins length
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Mock chrome object
      window.chrome = {
        runtime: {},
      };
      
      // Mock permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Cypress ? 'denied' : 'granted' }) :
          originalQuery(parameters)
      );
    });
    
    // 5. Configurar timeout
    await page.setDefaultNavigationTimeout(60000);
    
    // 6. Simular comportamiento humano - delay aleatorio antes de navegar
    await randomDelay(1000, 3000);
    
    // 7. Navegar a la página con configuración mejorada
    console.log(`[${requestId}] Navegando a: ${url}`);
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // 8. Verificar si llegamos a una página de bloqueo
    const currentUrl = page.url();
    if (isBlockedPage(currentUrl)) {
      console.warn(`[${requestId}] Detectada página de bloqueo: ${currentUrl}`);
      
      // Intentar con strategy de retry
      let retryCount = 0;
      const maxRetries = 2;
      
      while (isBlockedPage(page.url()) && retryCount < maxRetries) {
        console.log(`[${requestId}] Intento ${retryCount + 1} de ${maxRetries} para evitar bloqueo...`);
        
        // Esperar más tiempo
        await randomDelay(5000, 10000);
        
        // Cambiar user agent
        await page.setUserAgent(getRandomUserAgent());
        
        // Intentar navegar de nuevo
        await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 60000 
        });
        
        retryCount++;
      }
      
      // Si después de los reintentos sigue bloqueado
      if (isBlockedPage(page.url())) {
        throw new Error(`Página bloqueada persistentemente. URL final: ${page.url()}`);
      }
    }
    
    // 9. Simular scroll y comportamiento humano
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 4);
    });
    await randomDelay(500, 1500);
    
    let scrapedData = [];
    
    if (selectors && selectors.length > 0) {
      // Scraping con selectores específicos
      for (const selector of selectors) {
        try {
          const elements = await page.$$(selector);
          for (const element of elements) {
            const text = await element.evaluate(el => el.textContent?.trim());
            if (text) {
              scrapedData.push({
                selector,
                content: text,
                type: 'text'
              });
            }
          }
        } catch (error) {
          console.warn(`[${requestId}] Error con selector ${selector}:`, error.message);
        }
      }
    } else {
      // Scraping general de la página
      const title = await page.title();
      const description = await page.$eval('meta[name="description"]', el => el?.content) || '';
      
      // Extraer texto principal
      const mainContent = await page.evaluate(() => {
        const article = document.querySelector('article') || document.querySelector('main') || document.querySelector('.content') || document.body;
        return article.innerText?.trim() || '';
      });
      
      scrapedData.push({
        title,
        description,
        content: mainContent.substring(0, 2000), // Limitar contenido
        type: 'general'
      });
    }
    
    // Filtrar por palabras clave si se especifican
    if (keywords && keywords.length > 0) {
      scrapedData = scrapedData.filter(item => {
        const content = (item.content || item.title || '').toLowerCase();
        return keywords.some(keyword => content.includes(keyword.toLowerCase()));
      });
    }
    
    // Limitar resultados
    scrapedData = scrapedData.slice(0, maxResults);
    
    await page.close();
    await releaseBrowser(browser);
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Scraping completado en ${processingTime}ms`);
    
    res.json({
      success: true,
      data: scrapedData,
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        processingTime
      }
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error en scraping:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        url: req.body.url || '',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }
    });
  }
});

// Endpoint específico para búsquedas web para el asistente
app.post('/search-for-assistant', async (req, res) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    const { query, maxResults = 5, includeImages = false } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query es requerida',
        metadata: {
          url: '',
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      });
    }

    console.log(`[${requestId}] Búsqueda web para asistente: ${query}`);
    
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Configurar headers más realistas
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
    
    // Realizar búsqueda en Google con mejor manejo
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${maxResults}`;
    console.log(`[${requestId}] Navegando a: ${searchUrl}`);
    
    try {
      const response = await page.goto(searchUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      console.log(`[${requestId}] Response status: ${response?.status()}`);
      console.log(`[${requestId}] Final URL: ${page.url()}`);
      
      // Verificar si fuimos redirigidos a la página de bloqueo
      const currentUrl = page.url();
      if (currentUrl.includes('/sorry/') || currentUrl.includes('captcha')) {
        throw new Error('Google blocked the request - captcha or sorry page detected');
      }
      
      // Esperar un poco más para que la página se renderice completamente
      await page.waitForTimeout(2000);
      
      console.log(`[${requestId}] Intentando extraer resultados...`);
      
    } catch (gotoError) {
      console.error(`[${requestId}] Error en page.goto:`, gotoError.message);
      throw gotoError;
    }
    
    // Extraer resultados de búsqueda con mejor manejo de errores
    let searchResults = [];
    
    console.log(`[${requestId}] ✅ A punto de ejecutar page.evaluate()...`);
    console.log(`[${requestId}] URL actual: ${page.url()}`);
    
    // Verificar que la página esté lista
    try {
      const pageTitle = await page.title();
      console.log(`[${requestId}] Título de la página: "${pageTitle}"`);
      
      // Verificar si hay elementos en la página
      const bodyExists = await page.$('body');
      console.log(`[${requestId}] Body existe: ${!!bodyExists}`);
      
    } catch (checkError) {
      console.error(`[${requestId}] Error verificando página:`, checkError.message);
    }
    
    try {
      console.log(`[${requestId}] 🔄 Ejecutando page.evaluate() AHORA...`);
      
      searchResults = await page.evaluate(() => {
        console.log("🟢 ENTRANDO a page.evaluate()!");
        console.log("Document ready state:", document.readyState);
        console.log("Document URL:", document.URL);
        
        const results = [];
        
        // Intentar diferentes selectores que Google usa
        let searchResultElements = document.querySelectorAll('.g');
        console.log("Elementos con selector '.g':", searchResultElements.length);
        
        // Si no encuentra con .g, intentar otros selectores
        if (searchResultElements.length === 0) {
          searchResultElements = document.querySelectorAll('[data-result-index]');
          console.log("Elementos con selector '[data-result-index]':", searchResultElements.length);
        }
        
        if (searchResultElements.length === 0) {
          searchResultElements = document.querySelectorAll('.yuRUbf');
          console.log("Elementos con selector '.yuRUbf':", searchResultElements.length);
        }
        
        if (searchResultElements.length === 0) {
          // Debug: ver qué hay en la página
          console.log("❌ No se encontraron elementos de resultados");
          console.log("Contenido de body (primeros 500 chars):", document.body.innerText.substring(0, 500));
          console.log("Classes disponibles:", Array.from(document.querySelectorAll('*')).map(el => el.className).filter(c => c).slice(0, 20));
        }
        
        console.log("Total elementos encontrados:", searchResultElements.length);
        
        searchResultElements.forEach((element, index) => {
          if (index >= 2) return; // Limitar a 2 resultados

          const titleElement = element.querySelector('h3');
          const linkElement = element.querySelector('a');
          const snippetElement = element.querySelector('.VwiC3b');
          
          console.log(`Element ${index}:`, {
            hasTitle: !!titleElement,
            hasLink: !!linkElement,
            hasSnippet: !!snippetElement
          });
          
          if (titleElement && linkElement) {
            results.push({
              title: titleElement.textContent?.trim() || '',
              url: linkElement.href || '',
              snippet: snippetElement?.textContent?.trim() || '',
              position: index + 1
            });
          }
        });
        
        console.log("Results extracted:", results.length);
        return results;
      });
      
      console.log(`[${requestId}] Evaluate completed, found ${searchResults.length} results`);
      
      // Si no encontramos resultados, tomar screenshot para debug
      if (searchResults.length === 0) {
        console.log(`[${requestId}] ⚠️ No se encontraron resultados, tomando screenshot para debug...`);
        try {
          await page.screenshot({ path: `debug-screenshot-${requestId}.png`, fullPage: false });
          console.log(`[${requestId}] Screenshot guardado como debug-screenshot-${requestId}.png`);
        } catch (screenshotError) {
          console.error(`[${requestId}] Error tomando screenshot:`, screenshotError.message);
        }
      }
      
    } catch (evaluateError) {
      console.error(`[${requestId}] ❌ ERROR en page.evaluate:`, evaluateError.message);
      console.error(`[${requestId}] Stack trace:`, evaluateError.stack);
      
      // Intentar tomar screenshot del error
      try {
        await page.screenshot({ path: `error-screenshot-${requestId}.png`, fullPage: false });
        console.log(`[${requestId}] Error screenshot guardado como error-screenshot-${requestId}.png`);
      } catch (screenshotError) {
        console.error(`[${requestId}] Error tomando error screenshot:`, screenshotError.message);
      }
      
      searchResults = []; // Devolver array vacío en caso de error
    }
    
    await page.close();
    await releaseBrowser(browser);
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Búsqueda completada en ${processingTime}ms, ${searchResults.length} resultados`);
    
    res.json({
      success: true,
      data: searchResults,
      metadata: {
        url: searchUrl,
        timestamp: new Date().toISOString(),
        processingTime
      }
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error en búsqueda web:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        url: '',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }
    });
  }
});

// Endpoint para validar URLs
app.post('/validate-url', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({
      valid: false,
      error: 'URL es requerida'
    });
  }
  
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setDefaultNavigationTimeout(10000);
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    await page.close();
    await releaseBrowser(browser);
    
    res.json({
      valid: response.ok(),
      error: response.ok() ? null : `HTTP ${response.status()}: ${response.statusText()}`
    });
    
  } catch (error) {
    res.json({
      valid: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    browserPoolSize: browserPool.length
  });
});

// ===== ENDPOINTS DE SALUD Y CORS =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Web Scraping Service',
    version: '1.0.0'
  });
});

// Endpoint simple para verificar CORS
app.get('/cors-test', (req, res) => {
  res.status(200).json({
    message: 'CORS está funcionando correctamente',
    origin: req.headers.origin || 'Sin origin',
    timestamp: new Date().toISOString()
  });
});

// Endpoint POST para verificar CORS
app.post('/cors-test', (req, res) => {
  res.status(200).json({
    message: 'CORS POST está funcionando correctamente',
    origin: req.headers.origin || 'Sin origin',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Inicializar y arrancar el servidor
async function startServer() {
  try {
    await initializeBrowserPool();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor de web scraping iniciado en puerto ${PORT}`);
      console.log(`📊 Pool de navegadores: ${MAX_BROWSERS} instancias`);
      console.log(`🔒 Rate limiting: 100 requests/15min`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para limpieza
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  for (const browser of browserPool) {
    await browser.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  for (const browser of browserPool) {
    await browser.close();
  }
  process.exit(0);
});

startServer(); 