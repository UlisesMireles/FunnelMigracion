using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class WebScrapingDto
    {
    }
    public class ScrapeResponse
    {
        public bool Success { get; set; }
        public List<ScrapedData> Data { get; set; } = new();
        public string? Error { get; set; }
        public ResponseMetadata Metadata { get; set; } = new();
    }

    /// <summary>
    /// Respuesta de búsqueda del asistente
    /// </summary>
    public class SearchAssistantResponse
    {
        public bool Success { get; set; }
        public List<SearchResult> Data { get; set; } = new();
        public string? Error { get; set; }
        public ResponseMetadata Metadata { get; set; } = new();
    }

    /// <summary>
    /// Respuesta de validación de URL
    /// </summary>
    public class ValidateUrlResponse
    {
        public bool Success { get; set; }
        public bool IsValid { get; set; }
        public bool Accessible { get; set; }
        public int? StatusCode { get; set; }
        public string? Message { get; set; }
        public ResponseMetadata Metadata { get; set; } = new();
    }

    /// <summary>
    /// Request para validación de URL
    /// </summary>
    public class ValidateUrlRequest
    {
        [Required]
        [Url]
        public string Url { get; set; } = string.Empty;
    }
    public class ScrapeRequest
    {
        [Required]
        [Url]
        public string Url { get; set; } = string.Empty;
        public List<string> Selectors { get; set; } = new();
        public List<string> Keywords { get; set; } = new();
        [Range(1, 100)]
        public int MaxResults { get; set; } = 10;
        [Range(5000, 120000)]
        public int Timeout { get; set; } = 30000;
        public bool WaitForImages { get; set; } = true;
        public string? WaitForSelector { get; set; }
        public bool IncludeImages { get; set; } = false;
        public bool BypassBlocking { get; set; } = true;
    }

    public class SearchAssistantRequest
    {
        [Required]
        public string Query { get; set; } = string.Empty;
        [Range(1, 20)]
        public int MaxResults { get; set; } = 5;
        public bool IncludeImages { get; set; } = false;
    }

    public class ScrapedData
    {
        public string? Selector { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    public class SearchResult
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Source { get; set; } = string.Empty;
    }

    public class ResponseMetadata
    {
        public string Url { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double ProcessingTime { get; set; }
    }
}
