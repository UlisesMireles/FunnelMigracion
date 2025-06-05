using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IGraficasService
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
        Task<List<SectorDto>> ObtenerOportunidadesPorSector(RequestGrafica data);
        Task<List<OportunidadSectorDto>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data);
    }
}
