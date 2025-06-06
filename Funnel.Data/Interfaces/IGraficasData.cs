using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IGraficasData
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
        Task<List<SectorDto>> ObtenerOportunidadesPorSector(RequestGrafica data);
        Task<List<OportunidadSectorDto>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data);
    }
}
