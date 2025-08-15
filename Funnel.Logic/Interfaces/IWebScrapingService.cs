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
        Task<ScrapingResponse> BuscarInformacionParaAsistenteAsync(string consulta, int maxResultados = 5);
        Task<ScrapingResponse> ExtraerContenidoDePaginaAsync(string url, List<string>? selectores = null);
        Task<bool> ValidarUrlAntesDeScrapingAsync(string url);
        Task<ScrapingResponse> BusquedaInteligenteAsync(string query, int maxResultados = 5);
    }
}
