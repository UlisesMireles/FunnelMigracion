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
        public async Task<List<AniosDto>> Anios(int IdEmpresa, int IdEstatusOportunidad, int IdProceso)
        {
            return await _graficasData.Anios(IdEmpresa, IdEstatusOportunidad, IdProceso);
        }
        public async Task<List<GraficaDto>> ObtenerGraficaGanadasAnio(RequestGrafica data)
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

        public async Task<List<GraficaDto>> ObtenerGraficaClientesTopVeinte(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaClientesTopVeinte(data);
        }
        public async Task<List<OportunidadAgenteClienteDto>> ObtenerOportunidadesPorAgenteClientes(RequestGrafica data)
        {
            return await _graficasData.ObtenerOportunidadesPorAgenteClientes(data);
        }

        public async Task<List<TipoOportunidadAgenteDto>> ObtenerOportunidadesPorAgenteTipo(RequestGrafica data)
        {
            return await _graficasData.ObtenerOportunidadesPorAgenteTipo(data);
        }

        public async Task<List<DetalleOportunidadTipoAgenteDto>> ObtenerDetalleOportunidadesTipoAgente(int idAgente, int idTipoOporAgente, RequestGrafica data)
        {
            return await _graficasData.ObtenerDetalleOportunidadesTipoAgente(idAgente, idTipoOporAgente, data);
        }

        public async Task<List<TipoSectorAgenteDto>> ObtenerOportunidadesPorSectorPorAgente(RequestGrafica data)
        {
            return await _graficasData.ObtenerOportunidadesPorSectorPorAgente(data);
        }

        public async Task<List<DetalleSectorAgenteDto>> ObtenerDetallesPorSectorPorAgente(int idAgente, int idSector, RequestGrafica data)
        {
            return await _graficasData.ObtenerDetallesPorSectorPorAgente(idAgente, idSector, data);
        }
    }
}
