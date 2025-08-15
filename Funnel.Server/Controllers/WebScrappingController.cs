using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebScrappingController : Controller
    {
        private readonly IWebScrapingData _webScrapingService;

        public WebScrappingController(IWebScrapingData webScrapingService)
        {
            _webScrapingService = webScrapingService;
        }

        [HttpPost("scrape")]
        public async Task<IActionResult> ScrapeWebsite([FromBody] ScrapingRequest request)
        {
            try
            {
                var result = await _webScrapingService.ScrapeWebsiteAsync(request);

                if (result.Success)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpPost("search-for-assistant")]
        public async Task<IActionResult> SearchForAssistant([FromBody] WebSearchRequest request)
        {
            try
            {
                var result = await _webScrapingService.SearchForAssistantAsync(request);

                if (result.Success)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno del servidor" });
            }
        }

        [HttpPost("validate-url")]
        public async Task<IActionResult> ValidateUrl([FromBody] UrlValidationRequest request)
        {
            try
            {
                var result = await _webScrapingService.ValidateUrlAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(new UrlValidationResponse { Valid = false, Error = "Error al validar URL" });
            }
        }
    }
}
