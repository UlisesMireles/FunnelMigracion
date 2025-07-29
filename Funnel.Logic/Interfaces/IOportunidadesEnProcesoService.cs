using DinkToPdf;
using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IOportunidadesEnProcesoService
    {
        public Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus, int IdProceso);
        public Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request);
        public Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa);
        public Task<List<ComboServiciosDto>> ComboServicios(int IdEmpresa);
        public Task<List<ComboEtapasDto>> ComboEtapas(int IdEmpresa);
        public Task<List<ComboEntregasDto>> ComboEntregas(int IdEmpresa);
        public Task<List<ComboEjecutivosDto>> ComboEjecutivos(int IdEmpresa);
        public Task<List<ContactoDto>> ComboContactos(int IdEmpresa, int IdProspecto);
        public Task<List<ComboEstatusOportunidad>> ComboTipoOportunidad(int IdEmpresa);
        public Task<List<OportunidadesEnProcesoDto>> ConsultarHistoricoOportunidades(int IdEmpresa, int IdOportunidad, int IdProceso);
        public Task<BaseOut> GuardarHistorico(OportunidadesEnProcesoDto request);
        public Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorMes(int IdUsuario, int IdEmpresa, int IdProceso);
        public Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorEtapa(int IdUsuario, int IdEmpresa, int IdProceso);
        public Task<BaseOut> ActualizarFechaEstimada(OportunidadesEnProcesoDto request);
        public Task<byte[]> GenerarReporteSeguimientoOportunidades(int IdEmpresa, int IdOportunidad, string RutaBase, int IdProceso);
        public Task<byte[]> GenerarReporteOportunidades(OportunidadesReporteDto oportunidades, string RutaBase, string titulo, int IdEmpresa);
        public Task<BaseOut> ActualizarEtapa(OportunidadesEnProcesoDto request);
        public Task<EtiquetasOportunidadesDto> ConsultarEtiquetas(int IdEmpresa, int IdUsuario, int IdProceso);
    }
}
