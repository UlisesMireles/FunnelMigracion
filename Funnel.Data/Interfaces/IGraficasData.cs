using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IGraficasData
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
    }
}
