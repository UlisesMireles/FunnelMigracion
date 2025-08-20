using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebScrapingController : Controller
    {
        private readonly IMemoryCache _cache;
        private readonly IWebScrapingService _scrapingService;

        public WebScrapingController(
            IMemoryCache cache,
            IWebScrapingService scrapingService)
        {
            _cache = cache;
            _scrapingService = scrapingService;
        }

        /// <summary>
        /// Endpoint principal de scraping - Replica exactamente /scrape del Node.js
        /// </summary>
        [HttpPost("scrape")]
        public async Task<IActionResult> ScrapeAsync([FromBody] ScrapeRequest request)
        {
            var startTime = DateTime.UtcNow;
            var requestId = Guid.NewGuid().ToString();

            try
            {
                var result = await _scrapingService.ScrapeAsync(request, requestId);

                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;

                return Ok(new ScrapeResponse
                {
                    Success = true,
                    Data = result,
                    Metadata = new ResponseMetadata
                    {
                        Url = request.Url,
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
            catch (Exception ex)
            {
                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;

                return StatusCode(500, new ScrapeResponse
                {
                    Success = false,
                    Error = ex.Message,
                    Metadata = new ResponseMetadata
                    {
                        Url = request.Url ?? string.Empty,
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
        }

        /// <summary>
        /// Endpoint para búsquedas web específicas para el asistente - Replica /search-for-assistant
        /// </summary>
        [HttpPost("search-for-assistant")]
        public async Task<IActionResult> SearchForAssistantAsync([FromBody] SearchAssistantRequest request)
        {
            var startTime = DateTime.UtcNow;
            var requestId = Guid.NewGuid().ToString();

            try
            {
                var result = await _scrapingService.SearchForAssistantAsync(request, requestId);

                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;

                return Ok(new SearchAssistantResponse
                {
                    Success = true,
                    Data = result,
                    Metadata = new ResponseMetadata
                    {
                        Url = $"search:{request.Query}",
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
            catch (Exception ex)
            {
                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
                return StatusCode(500, new SearchAssistantResponse
                {
                    Success = false,
                    Error = ex.Message,
                    Metadata = new ResponseMetadata
                    {
                        Url = $"search:{request.Query}",
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
        }

        /// <summary>
        /// Endpoint para validar URLs - Replica /validate-url
        /// </summary>
        [HttpPost("validate-url")]
        public async Task<IActionResult> ValidateUrlAsync([FromBody] ValidateUrlRequest request)
        {
            var startTime = DateTime.UtcNow;
            var requestId = Guid.NewGuid().ToString();

            try
            {
                var result = await _scrapingService.ValidateUrlAsync(request.Url, requestId);

                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;

                return Ok(new ValidateUrlResponse
                {
                    Success = true,
                    IsValid = result.IsValid,
                    Accessible = result.Accessible,
                    StatusCode = result.StatusCode,
                    Message = result.Message,
                    Metadata = new ResponseMetadata
                    {
                        Url = request.Url,
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
            catch (Exception ex)
            {
                var processingTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
                return StatusCode(500, new ValidateUrlResponse
                {
                    Success = false,
                    IsValid = false,
                    Message = ex.Message,
                    Metadata = new ResponseMetadata
                    {
                        Url = request.Url ?? string.Empty,
                        Timestamp = DateTime.UtcNow,
                        ProcessingTime = processingTime
                    }
                });
            }
        }

        /// <summary>
        /// Health check endpoint - Replica /health del Node.js
        /// </summary>
        [HttpGet("health")]
        public IActionResult GetHealth()
        {
            try
            {
                var uptime = Environment.TickCount64; // Milisegundos desde inicio
                var memory = GC.GetTotalMemory(false);
                var activeBrowsers = _scrapingService.GetActiveBrowsersCount();

                return Ok(new
                {
                    status = "healthy",
                    timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    uptime = uptime / 1000.0, // Convertir a segundos como en Node.js
                    memory = new
                    {
                        rss = memory,
                        heapUsed = memory,
                        heapTotal = memory * 1.2, // Aproximación
                        external = memory * 0.1   // Aproximación
                    },
                    activeBrowsers = activeBrowsers
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "unhealthy",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                });
            }
        }

        /// <summary>
        /// Test CORS endpoint GET - Replica /cors-test
        /// </summary>
        [HttpGet("cors-test")]
        public IActionResult CorsTestGet()
        {
            var origin = Request.Headers["Origin"].FirstOrDefault();
            var userAgent = Request.Headers["User-Agent"].FirstOrDefault();

            return Ok(new
            {
                success = true,
                message = "CORS configurado correctamente",
                method = "GET",
                origin = origin ?? "null",
                userAgent = userAgent ?? "unknown",
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString())
            });
        }

        /// <summary>
        /// Test CORS endpoint POST - Replica /cors-test
        /// </summary>
        [HttpPost("cors-test")]
        public IActionResult CorsTestPost([FromBody] object? data)
        {
            var origin = Request.Headers["Origin"].FirstOrDefault();
            var userAgent = Request.Headers["User-Agent"].FirstOrDefault();

            return Ok(new
            {
                success = true,
                message = "CORS POST configurado correctamente",
                method = "POST",
                origin = origin ?? "null",
                userAgent = userAgent ?? "unknown",
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                receivedData = data,
                headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString())
            });
        }

        /// <summary>
        /// Endpoint adicional para obtener estadísticas del servicio
        /// </summary>
        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            try
            {
                return Ok(new
                {
                    service = "Web Scraping Service .NET",
                    version = "1.0.0",
                    activeBrowsers = _scrapingService.GetActiveBrowsersCount(),
                    uptime = Environment.TickCount64 / 1000.0,
                    memoryUsage = GC.GetTotalMemory(false),
                    endpoints = new[]
                    {
                        "/api/webscraping/scrape",
                        "/api/webscraping/search-for-assistant",
                        "/api/webscraping/validate-url",
                        "/api/webscraping/health",
                        "/api/webscraping/cors-test"
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
