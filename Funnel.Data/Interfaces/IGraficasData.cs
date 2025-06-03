using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IGraficasData
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
    }
}
