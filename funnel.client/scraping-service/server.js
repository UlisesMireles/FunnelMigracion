const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Pool de navegadores para mejor rendimiento
let browserPool = [];
const MAX_BROWSERS = 5;

async function initializeBrowserPool() {
  try {
    for (let i = 0; i < MAX_BROWSERS; i++) {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      browserPool.push(browser);
    }
    console.log(`Pool de navegadores inicializado con ${MAX_BROWSERS} instancias`);
  } catch (error) {
    console.error('Error inicializando pool de navegadores:', error);
  }
}

async function getBrowser() {
  if (browserPool.length === 0) {
    await initializeBrowserPool();
  }
  return browserPool.shift();
}

async function releaseBrowser(browser) {
  if (browserPool.length < MAX_BROWSERS) {
    browserPool.push(browser);
  } else {
    await browser.close();
  }
}

// Endpoint de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    browserPoolSize: browserPool.length 
  });
});

// Endpoint principal de scraping
app.post('/api/scrape', async (req, res) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  try {
    const { url, selectors = [], keywords = [], maxResults = 10, includeImages = false } = req.body;

    // Validaciones
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL es requerida',
        requestId
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        requestId
      });
    }

    console.log(`[${requestId}] Iniciando scraping de: ${url}`);

    const browser = await getBrowser();
    const page = await browser.newPage();

    // Configurar user agent y viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    // Configurar timeouts
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    // Navegar a la página
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extraer datos según selectores
    let extractedData = [];
    
    if (selectors.length > 0) {
      extractedData = await extractBySelectors(page, selectors);
    } else {
      // Extracción automática de contenido
      extractedData = await extractAutoContent(page, keywords, maxResults);
    }

    // Filtrar por palabras clave si se especifican
    if (keywords.length > 0) {
      extractedData = filterByKeywords(extractedData, keywords);
    }

    // Limitar resultados
    extractedData = extractedData.slice(0, maxResults);

    await page.close();
    await releaseBrowser(browser);

    const processingTime = Date.now() - startTime;

    console.log(`[${requestId}] Scraping completado en ${processingTime}ms. Resultados: ${extractedData.length}`);

    res.json({
      success: true,
      data: extractedData,
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        processingTime,
        requestId,
        resultsCount: extractedData.length
      }
    });

  } catch (error) {
    console.error(`[${requestId}] Error en scraping:`, error);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
});

// Endpoint para validar URLs
app.post('/api/validate', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ valid: false, error: 'URL es requerida' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ valid: false, error: 'URL inválida' });
    }

    const browser = await getBrowser();
    const page = await browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
      await page.close();
      await releaseBrowser(browser);
      
      res.json({ valid: true });
    } catch (error) {
      await page.close();
      await releaseBrowser(browser);
      
      res.json({ valid: false, error: 'No se pudo acceder a la URL' });
    }

  } catch (error) {
    console.error('Error validando URL:', error);
    res.status(500).json({ valid: false, error: 'Error interno del servidor' });
  }
});

// Funciones auxiliares
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function extractBySelectors(page, selectors) {
  const results = [];
  
  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector);
      
      for (const element of elements) {
        const text = await element.evaluate(el => el.textContent?.trim());
        const href = await element.evaluate(el => el.href);
        
        if (text) {
          results.push({
            id: uuidv4(),
            content: text,
            url: href || null,
            selector,
            type: 'selector'
          });
        }
      }
    } catch (error) {
      console.warn(`Error extrayendo selector ${selector}:`, error.message);
    }
  }
  
  return results;
}

async function extractAutoContent(page, keywords, maxResults) {
  const results = [];
  
  try {
    // Extraer títulos
    const titles = await page.$$eval('h1, h2, h3', elements => 
      elements.map(el => ({
        text: el.textContent?.trim(),
        tag: el.tagName.toLowerCase(),
        id: el.id || null
      }))
    );

    // Extraer párrafos
    const paragraphs = await page.$$eval('p', elements => 
      elements.map(el => el.textContent?.trim()).filter(text => text && text.length > 50)
    );

    // Extraer enlaces
    const links = await page.$$eval('a[href]', elements => 
      elements.map(el => ({
        text: el.textContent?.trim(),
        href: el.href,
        title: el.title || null
      })).filter(link => link.text && link.href)
    );

    // Combinar y procesar resultados
    titles.forEach(title => {
      if (title.text) {
        results.push({
          id: uuidv4(),
          title: title.text,
          content: title.text,
          type: 'title',
          tag: title.tag
        });
      }
    });

    paragraphs.forEach(paragraph => {
      if (paragraph) {
        results.push({
          id: uuidv4(),
          content: paragraph,
          type: 'paragraph'
        });
      }
    });

    links.forEach(link => {
      if (link.text) {
        results.push({
          id: uuidv4(),
          title: link.text,
          content: link.text,
          url: link.href,
          type: 'link'
        });
      }
    });

  } catch (error) {
    console.error('Error en extracción automática:', error);
  }
  
  return results;
}

function filterByKeywords(data, keywords) {
  return data.filter(item => {
    const content = `${item.title || ''} ${item.content || ''}`.toLowerCase();
    return keywords.some(keyword => content.includes(keyword.toLowerCase()));
  });
}

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Inicializar y arrancar servidor
async function startServer() {
  try {
    await initializeBrowserPool();
    
    app.listen(PORT, () => {
      console.log(`Servidor de scraping iniciado en puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales para limpieza
process.on('SIGTERM', async () => {
  console.log('Recibida señal SIGTERM, cerrando navegadores...');
  for (const browser of browserPool) {
    await browser.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Recibida señal SIGINT, cerrando navegadores...');
  for (const browser of browserPool) {
    await browser.close();
  }
  process.exit(0);
});

startServer(); 