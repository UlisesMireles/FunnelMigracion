using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IGraficasData
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
        public Task<List<AniosDto>> Anios(int idEmpresa, int idEstatusOportunidad);
        Task<List<GraficaDto>> ObtenerGraficaGanadasAnio(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentesPorAnio(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentesPorAnio(RequestGrafica data);
        Task<List<SectorDto>> ObtenerOportunidadesPorSector(RequestGrafica data);
        Task<List<OportunidadSectorDto>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data);
        Task<List<TipoProyectoDto>> ObtenerOportunidadesPorTipo(RequestGrafica data);
        Task<List<OportunidadTipoDto>> ObtenerDetalleOportunidadesTipo(int idTipoProyecto, RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaClientesTopVeinte(RequestGrafica data);
    }
}
