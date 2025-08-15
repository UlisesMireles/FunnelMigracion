using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class WebScrapingDto
    {
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
