using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IGraficasService
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
    }
}
