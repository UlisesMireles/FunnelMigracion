using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IWebScrapingData
    {
        Task<ScrapingResponse> ScrapeWebsiteAsync(ScrapingRequest request);
        Task<ScrapingResponse> SearchForAssistantAsync(WebSearchRequest request);
        Task<UrlValidationResponse> ValidateUrlAsync(UrlValidationRequest request);
    }
}
