using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;

namespace Funnel.Logic
{
    public class WebScrapingService : IWebScrapingService
    {
        private readonly IWebScrapingData _webScrapingService;

        public WebScrapingService(IWebScrapingData webScrapingService)
        {
            _webScrapingService = webScrapingService;
        }

        /// <summary>
        /// Método principal para búsquedas web que usa el asistente
        /// </summary>
        public async Task<ScrapingResponse> BuscarInformacionParaAsistenteAsync(string consulta, int maxResultados = 5)
        {
            try
            {

                var request = new WebSearchRequest
                {
                    Query = consulta,
                    MaxResults = maxResultados,
                    IncludeImages = false
                };

                var resultado = await _webScrapingService.SearchForAssistantAsync(request);

                

                return resultado;
            }
            catch (Exception ex)
            {
              
                return new ScrapingResponse
                {
                    Success = false,
                    Error = "Error interno en la búsqueda"
                };
            }
        }

        /// <summary>
        /// Extrae contenido específico de una página web
        /// </summary>
        public async Task<ScrapingResponse> ExtraerContenidoDePaginaAsync(string url, List<string>? selectores = null)
        {
            try
            {
                // Primero validar la URL
                var esValida = await ValidarUrlAntesDeScrapingAsync(url);
                if (!esValida)
                {
                    return new ScrapingResponse
                    {
                        Success = false,
                        Error = "URL no válida o no accesible"
                    };
                }

                var request = new ScrapingRequest
                {
                    Url = url,
                    Selectors = selectores,
                    MaxResults = 10,
                    IncludeImages = false
                };

                var resultado = await _webScrapingService.ScrapeWebsiteAsync(request);

                

                return resultado;
            }
            catch (Exception ex)
            {
                
                return new ScrapingResponse
                {
                    Success = false,
                    Error = "Error interno en la extracción"
                };
            }
        }

        /// <summary>
        /// Valida si una URL es accesible antes de hacer scraping
        /// </summary>
        public async Task<bool> ValidarUrlAntesDeScrapingAsync(string url)
        {
            try
            {
                var request = new UrlValidationRequest { Url = url };
                var resultado = await _webScrapingService.ValidateUrlAsync(request);

                return resultado.Valid;
            }
            catch (Exception ex)
            {
                
                return false;
            }
        }

        /// <summary>
        /// Búsqueda inteligente que combina múltiples fuentes
        /// </summary>
        public async Task<ScrapingResponse> BusquedaInteligenteAsync(string query, int maxResultados = 5)
        {
            try
            {
                // Aquí podrías agregar lógica adicional como:
                // - Filtrar resultados por relevancia
                // - Combinar múltiples fuentes
                // - Aplicar reglas de negocio específicas

                var resultado = await BuscarInformacionParaAsistenteAsync(query, maxResultados);

                // Ejemplo de lógica adicional: filtrar resultados muy cortos
                if (resultado.Success && resultado.Data.Any())
                {
                    var resultadosFiltrados = resultado.Data.Where(item =>
                    {
                        if (item is System.Text.Json.JsonElement element)
                        {
                            if (element.TryGetProperty("snippet", out var snippet))
                            {
                                return snippet.GetString()?.Length > 50; // Filtrar snippets muy cortos
                            }
                        }
                        return true;
                    }).ToList();

                    resultado.Data = resultadosFiltrados;
                }

                return resultado;
            }
            catch (Exception ex)
            {
                return new ScrapingResponse
                {
                    Success = false,
                    Error = "Error en búsqueda inteligente"
                };
            }
        }
    }
}
