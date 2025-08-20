using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;
using System.Collections.Concurrent;

namespace Funnel.Logic
{
    public class WebScrapingService : IDisposable, IWebScrapingService
    {
        private readonly ILogger<WebScrapingService> _logger;
        private readonly IMemoryCache _cache;
        private readonly ConcurrentQueue<IBrowser> _browserPool;
        private readonly SemaphoreSlim _browserSemaphore;
        private readonly Random _random;

        private const int MaxBrowsers = 3;
        private const int BrowserTimeout = 60000;
        private const int RequestTimeout = 120000;

        // User Agents rotativos para anti-detección
        private static readonly string[] UserAgents = {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0"
        };

        // Patrones de páginas bloqueadas
        private static readonly string[] BlockedPatterns = {
            "/sorry/", "captcha", "blocked", "access-denied", "bot-detection",
            "unusual-traffic", "/challenge", "security-check"
        };

        public WebScrapingService(ILogger<WebScrapingService> logger, IMemoryCache cache)
        {
            _logger = logger;
            _cache = cache;
            _browserPool = new ConcurrentQueue<IBrowser>();
            _browserSemaphore = new SemaphoreSlim(MaxBrowsers, MaxBrowsers);
            _random = new Random();

            // Inicializar pool de navegadores
            _ = Task.Run(InitializeBrowserPoolAsync);
        }

        /// <summary>
        /// Inicializa el pool de navegadores
        /// </summary>
        private async Task InitializeBrowserPoolAsync()
        {
            try
            {
                for (int i = 0; i < MaxBrowsers; i++)
                {
                    var browser = await LaunchBrowserAsync();
                    _browserPool.Enqueue(browser);
                }
                _logger.LogInformation("Pool de navegadores inicializado con {Count} instancias", MaxBrowsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inicializando pool de navegadores");
            }
        }

        /// <summary>
        /// Lanza una nueva instancia de navegador con configuración anti-detección
        /// </summary>
        private async Task<IBrowser> LaunchBrowserAsync()
        {
            var launchOptions = new LaunchOptions
            {
                Headless = true,
                Timeout = BrowserTimeout,
                Args = new[]
                {
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                    "--disable-web-security",
                    "--disable-features=VizDisplayCompositor",
                    "--disable-background-timer-throttling",
                    "--disable-backgrounding-occluded-windows",
                    "--disable-renderer-backgrounding",
                    "--disable-blink-features=AutomationControlled",
                    "--no-default-browser-check",
                    "--disable-default-apps",
                    "--window-size=1920,1080"
                }
            };
            var result = await Puppeteer.LaunchAsync(launchOptions);
            return result;
        }

        /// <summary>
        /// Obtiene un navegador del pool
        /// </summary>
        private async Task<IBrowser> GetBrowserAsync()
        {
            await _browserSemaphore.WaitAsync();

            if (_browserPool.TryDequeue(out var browser))
            {
                // Verificar si el navegador sigue conectado
                if (browser.IsConnected)
                {
                    return browser;
                }
                else
                {
                    await browser.DisposeAsync();
                }
            }

            // Crear nuevo navegador si no hay disponibles
            return await LaunchBrowserAsync();
        }

        /// <summary>
        /// Devuelve un navegador al pool
        /// </summary>
        private void ReleaseBrowser(IBrowser browser)
        {
            if (browser.IsConnected)
            {
                _browserPool.Enqueue(browser);
            }
            else
            {
                _ = Task.Run(async () => await browser.DisposeAsync());
            }

            _browserSemaphore.Release();
        }

        /// <summary>
        /// Obtiene un User Agent aleatorio
        /// </summary>
        private string GetRandomUserAgent()
        {
            return UserAgents[_random.Next(UserAgents.Length)];
        }

        /// <summary>
        /// Genera un delay aleatorio para simular comportamiento humano
        /// </summary>
        private async Task RandomDelayAsync(int min = 1000, int max = 3000)
        {
            var delay = _random.Next(min, max + 1);
            await Task.Delay(delay);
        }

        /// <summary>
        /// Detecta si una página está bloqueada
        /// </summary>
        private bool IsBlockedPage(string url)
        {
            return BlockedPatterns.Any(pattern =>
                url.ToLowerInvariant().Contains(pattern.ToLowerInvariant()));
        }

        /// <summary>
        /// Método principal de scraping
        /// </summary>
        public async Task<List<ScrapedData>> ScrapeAsync(ScrapeRequest request, string requestId)
        {
            var browser = await GetBrowserAsync();
            IPage? page = null;

            try
            {
                // Crear nueva página con configuración anti-detección
                page = await browser.NewPageAsync();

                // Configurar User Agent aleatorio
                await page.SetUserAgentAsync(GetRandomUserAgent());

                // Configurar viewport realista
                await page.SetViewportAsync(new ViewPortOptions
                {
                    Width = 1920,
                    Height = 1080
                });

                // Configurar headers adicionales
                await page.SetExtraHttpHeadersAsync(new Dictionary<string, string>
                {
                    {"Accept-Language", "es-ES,es;q=0.9,en;q=0.8"},
                    {"Accept-Encoding", "gzip, deflate, br"},
                    {"Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
                    {"Connection", "keep-alive"},
                    {"Upgrade-Insecure-Requests", "1"}
                });

                // Interceptar requests para optimizar carga
                await page.SetRequestInterceptionAsync(true);
                page.Request += async (sender, e) =>
                {
                    var resourceType = e.Request.ResourceType;

                    // Bloquear recursos innecesarios si no se requieren imágenes
                    if (!request.IncludeImages &&
                        (resourceType == ResourceType.Image ||
                         resourceType == ResourceType.Font ||
                         resourceType == ResourceType.Media))
                    {
                        await e.Request.AbortAsync();
                    }
                    else
                    {
                        await e.Request.ContinueAsync();
                    }
                };

                // Navegar a la URL con timeout
                var navigationOptions = new NavigationOptions
                {
                    Timeout = request.Timeout,
                    WaitUntil = new[] { WaitUntilNavigation.Networkidle0 }
                };

                await page.GoToAsync(request.Url, navigationOptions);

                // Verificar si la página está bloqueada
                if (IsBlockedPage(page.Url))
                {
                    _logger.LogWarning("[{RequestId}] Página bloqueada detectada: {Url}", requestId, page.Url);

                    if (request.BypassBlocking)
                    {
                        // Intentar bypass básico
                        await RandomDelayAsync(2000, 5000);
                        await page.ReloadAsync();

                        if (IsBlockedPage(page.Url))
                        {
                            throw new Exception($"Página bloqueada persistentemente: {page.Url}");
                        }
                    }
                }

                // Esperar selector específico si se proporciona
                if (!string.IsNullOrEmpty(request.WaitForSelector))
                {
                    await page.WaitForSelectorAsync(request.WaitForSelector, new WaitForSelectorOptions
                    {
                        Timeout = 10000
                    });
                }

                // Simular comportamiento humano
                await page.EvaluateExpressionAsync("window.scrollTo(0, document.body.scrollHeight / 4)");
                await RandomDelayAsync(500, 1500);

                var scrapedData = new List<ScrapedData>();

                if (request.Selectors?.Any() == true)
                {
                    // Scraping con selectores específicos
                    foreach (var selector in request.Selectors)
                    {
                        try
                        {
                            var elements = await page.QuerySelectorAllAsync(selector);
                            foreach (var element in elements)
                            {
                                var text = await element.EvaluateFunctionAsync<string>("el => el.textContent?.trim()");
                                if (!string.IsNullOrWhiteSpace(text))
                                {
                                    scrapedData.Add(new ScrapedData
                                    {
                                        Selector = selector,
                                        Content = text,
                                        Type = "text"
                                    });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning("[{RequestId}] Error con selector {Selector}: {Message}",
                                requestId, selector, ex.Message);
                        }
                    }
                }
                else
                {
                    // Scraping general de la página
                    var title = await page.GetTitleAsync();

                    var description = await page.EvaluateFunctionAsync<string>(@"
                        () => {
                            const meta = document.querySelector('meta[name=""description""]');
                            return meta ? meta.content : '';
                        }
                    ");

                    var mainContent = await page.EvaluateFunctionAsync<string>(@"
                        () => {
                            const article = document.querySelector('article') || 
                                          document.querySelector('main') || 
                                          document.querySelector('.content') || 
                                          document.body;
                            return article.innerText?.trim() || '';
                        }
                    ");

                    scrapedData.Add(new ScrapedData
                    {
                        Title = title,
                        Description = description,
                        Content = mainContent.Length > 2000 ? mainContent.Substring(0, 2000) : mainContent,
                        Type = "general"
                    });
                }

                // Filtrar por palabras clave
                if (request.Keywords?.Any() == true)
                {
                    scrapedData = scrapedData.Where(item =>
                    {
                        var content = $"{item.Content} {item.Title}".ToLowerInvariant();
                        return request.Keywords.Any(keyword =>
                            content.Contains(keyword.ToLowerInvariant()));
                    }).ToList();
                }

                // Limitar resultados
                return scrapedData.Take(request.MaxResults).ToList();
            }
            finally
            {
                if (page != null)
                {
                    await page.CloseAsync();
                }
                ReleaseBrowser(browser);
            }
        }

        /// <summary>
        /// Búsqueda web para el asistente
        /// </summary>
        public async Task<List<SearchResult>> SearchForAssistantAsync(SearchAssistantRequest request, string requestId)
        {
            // Implementar búsqueda en Google/Bing usando scraping
            var searchUrl = $"https://www.google.com/search?q={Uri.EscapeDataString(request.Query)}";

            var scrapeRequest = new ScrapeRequest
            {
                Url = searchUrl,
                Selectors = new List<string> { "h3", ".g .yuRUbf a", ".g .VwiC3b" },
                MaxResults = request.MaxResults,
                Timeout = 30000
            };

            var scrapedData = await ScrapeAsync(scrapeRequest, requestId);

            return scrapedData.Select(data => new SearchResult
            {
                Title = data.Title ?? data.Content.Substring(0, Math.Min(100, data.Content.Length)),
                Description = data.Content,
                Url = searchUrl,
                Source = "Google Search"
            }).ToList();
        }

        /// <summary>
        /// Validar URL
        /// </summary>
        public async Task<(bool IsValid, bool Accessible, int? StatusCode, string Message)> ValidateUrlAsync(
            string url, string requestId)
        {
            try
            {
                // Validar formato de URL
                if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
                {
                    return (false, false, null, "Formato de URL inválido");
                }

                // Intentar acceso básico
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(10);

                var response = await client.GetAsync(url);
                var statusCode = (int)response.StatusCode;

                return (true, response.IsSuccessStatusCode, statusCode,
                    response.IsSuccessStatusCode ? "URL accesible" : $"Error HTTP {statusCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[{RequestId}] Error validando URL {Url}", requestId, url);
                return (false, false, null, ex.Message);
            }
        }

        /// <summary>
        /// Obtiene el número de navegadores activos
        /// </summary>
        public int GetActiveBrowsersCount()
        {
            return _browserPool.Count;
        }

        /// <summary>
        /// Dispose de recursos
        /// </summary>
        public void Dispose()
        {
            while (_browserPool.TryDequeue(out var browser))
            {
                _ = Task.Run(async () => await browser.DisposeAsync());
            }

            _browserSemaphore?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
