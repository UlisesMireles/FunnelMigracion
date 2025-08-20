using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Interfaces
{
    public interface IWebScrapingService
    {
        public Task<List<ScrapedData>> ScrapeAsync(ScrapeRequest request, string requestId);
        public Task<List<SearchResult>> SearchForAssistantAsync(SearchAssistantRequest request, string requestId);
        public Task<(bool IsValid, bool Accessible, int? StatusCode, string Message)> ValidateUrlAsync(string url, string requestId);
        public int GetActiveBrowsersCount();
    }
}