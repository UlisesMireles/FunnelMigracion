using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
namespace Funnel.Logic
{
    public class GraficasService : IGraficasService
    {
        private readonly IGraficasData _graficasData;
        public GraficasService(IGraficasData graficasData)
        {
            _graficasData = graficasData;
        }
        public async Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaOportunidades(data);
        }
        public async Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaAgentes(data);
        }
        public async Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data)
        {
            return await _graficasData.ObtenerAgentes(data);
        }
        public async Task<List<AniosDto>> Anios(int IdEmpresa, int IdEstatusOportunidad)
        {
            return await _graficasData.Anios( IdEmpresa, IdEstatusOportunidad);
        }
        public async Task<List<GraficaDto>>ObtenerGraficaGanadasAnio(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaGanadasAnio(data);
        }
        public async Task<List<AgenteDto>> ObtenerAgentesPorAnio(RequestGrafica data)
        {
            return await _graficasData.ObtenerAgentesPorAnio(data);
        }
        public async Task<List<GraficaDto>> ObtenerGraficaAgentesPorAnio(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaAgentesPorAnio(data);
        }
        public async Task<List<SectorDto>> ObtenerOportunidadesPorSector(RequestGrafica data)
        {
            return await _graficasData.ObtenerOportunidadesPorSector(data);
        }

        public async Task<List<OportunidadSectorDto>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data)
        {
            return await _graficasData.ObtenerDetalleOportunidadesSector(idSector, data);
        }
        public async Task<List<TipoProyectoDto>> ObtenerOportunidadesPorTipo(RequestGrafica data)
        {
            return await _graficasData.ObtenerOportunidadesPorTipo(data);
        }

        public async Task<List<OportunidadTipoDto>> ObtenerDetalleOportunidadesTipo(int idTipoProyecto, RequestGrafica data)
        {
            return await _graficasData.ObtenerDetalleOportunidadesTipo(idTipoProyecto, data);
        }
    }
}
