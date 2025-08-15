using Funnel.Data.Interfaces;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class WebScrapingData : IWebScrapingData
    {
        private readonly IConfiguration _configuration;

        public WebScrapingData(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private HttpClient CreateClient()
        {
            var baseUrl = _configuration["WebScrapingService:Url"] ?? "http://localhost:3000";
            var client = new HttpClient
            {
                BaseAddress = new Uri(baseUrl)
            };
            client.DefaultRequestHeaders.Add("User-Agent", "Funnel-WebScraping-Service/1.0");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            return client;
        }

        public async Task<ScrapingResponse> ScrapeWebsiteAsync(ScrapingRequest request)
        {
            try
            {
                using var client = CreateClient();

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("/scrape", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ScrapingResponse>(responseContent);
                    return result ?? new ScrapingResponse { Success = false, Error = "Respuesta vacía del servicio" };
                }
                else
                {
                    return new ScrapingResponse
                    {
                        Success = false,
                        Error = $"Error en el servicio de scraping: {response.StatusCode}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new ScrapingResponse
                {
                    Success = false,
                    Error = "Error interno del servidor"
                };
            }
        }

        public async Task<ScrapingResponse> SearchForAssistantAsync(WebSearchRequest request)
        {
            try
            {
                using var client = CreateClient();

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("/search-for-assistant", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ScrapingResponse>(responseContent);
                    return result ?? new ScrapingResponse { Success = false, Error = "Respuesta vacía del servicio" };
                }
                else
                {
                    return new ScrapingResponse
                    {
                        Success = false,
                        Error = $"Error en la búsqueda web: {response.StatusCode}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new ScrapingResponse
                {
                    Success = false,
                    Error = "Error interno del servidor"
                };
            }
        }

        public async Task<UrlValidationResponse> ValidateUrlAsync(UrlValidationRequest request)
        {
            try
            {
                using var client = CreateClient();

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("/validate-url", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<UrlValidationResponse>(responseContent);
                    return result ?? new UrlValidationResponse { Valid = false, Error = "Respuesta vacía del servicio" };
                }
                else
                {
                    return new UrlValidationResponse { Valid = false, Error = "URL no válida" };
                }
            }
            catch (Exception)
            {
                return new UrlValidationResponse { Valid = false, Error = "Error al validar URL" };
            }
        }
    }
}
