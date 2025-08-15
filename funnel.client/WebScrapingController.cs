using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Funnel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebScrapingController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<WebScrapingController> _logger;

        public WebScrapingController(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<WebScrapingController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("scrape")]
        public async Task<IActionResult> ScrapeWebsite([FromBody] ScrapingRequest request)
        {
            try
            {
                var scrapingServiceUrl = _configuration["WebScrapingService:Url"] ?? "http://localhost:3000";
                
                using var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(2);

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{scrapingServiceUrl}/scrape", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ScrapingResponse>(responseContent);
                    return Ok(result);
                }
                else
                {
                    _logger.LogError("Error en servicio de scraping: {StatusCode}", response.StatusCode);
                    return StatusCode((int)response.StatusCode, new { error = "Error en el servicio de scraping" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al realizar scraping");
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpPost("search-for-assistant")]
        public async Task<IActionResult> SearchForAssistant([FromBody] WebSearchRequest request)
        {
            try
            {
                var scrapingServiceUrl = _configuration["WebScrapingService:Url"] ?? "http://localhost:3000";
                
                using var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromMinutes(2);

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{scrapingServiceUrl}/search-for-assistant", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ScrapingResponse>(responseContent);
                    return Ok(result);
                }
                else
                {
                    _logger.LogError("Error en búsqueda web: {StatusCode}", response.StatusCode);
                    return StatusCode((int)response.StatusCode, new { error = "Error en la búsqueda web" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al realizar búsqueda web");
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpPost("validate-url")]
        public async Task<IActionResult> ValidateUrl([FromBody] UrlValidationRequest request)
        {
            try
            {
                var scrapingServiceUrl = _configuration["WebScrapingService:Url"] ?? "http://localhost:3000";
                
                using var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{scrapingServiceUrl}/validate-url", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<UrlValidationResponse>(responseContent);
                    return Ok(result);
                }
                else
                {
                    return Ok(new UrlValidationResponse { Valid = false, Error = "URL no válida" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al validar URL");
                return Ok(new UrlValidationResponse { Valid = false, Error = "Error al validar URL" });
            }
        }
    }

    public class ScrapingRequest
    {
        public string Url { get; set; } = string.Empty;
        public List<string>? Selectors { get; set; }
        public List<string>? Keywords { get; set; }
        public int MaxResults { get; set; } = 10;
        public bool IncludeImages { get; set; } = false;
        public string? SearchQuery { get; set; }
    }

    public class WebSearchRequest
    {
        public string Query { get; set; } = string.Empty;
        public int MaxResults { get; set; } = 5;
        public bool IncludeImages { get; set; } = false;
    }

    public class ScrapingResponse
    {
        public bool Success { get; set; }
        public List<object> Data { get; set; } = new List<object>();
        public ScrapingMetadata Metadata { get; set; } = new ScrapingMetadata();
        public string? Error { get; set; }
    }

    public class ScrapingMetadata
    {
        public string Url { get; set; } = string.Empty;
        public string Timestamp { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ");
        public double ProcessingTime { get; set; }
    }

    public class UrlValidationRequest
    {
        public string Url { get; set; } = string.Empty;
    }

    public class UrlValidationResponse
    {
        public bool Valid { get; set; }
        public string? Error { get; set; }
    }
} 