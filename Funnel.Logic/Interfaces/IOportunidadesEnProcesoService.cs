using DinkToPdf;
using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IOportunidadesEnProcesoService
    {
        public Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus);
        public Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request);
        public Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa);
        public Task<List<ComboServiciosDto>> ComboServicios(int IdEmpresa);
        public Task<List<ComboEtapasDto>> ComboEtapas(int IdEmpresa);
        public Task<List<ComboEntregasDto>> ComboEntregas(int IdEmpresa);
        public Task<List<ComboEjecutivosDto>> ComboEjecutivos(int IdEmpresa);
        public Task<List<ContactoDto>> ComboContactos(int IdEmpresa, int IdProspecto);
        public Task<List<ComboEstatusOportunidad>> ComboTipoOportunidad(int IdEmpresa);
        public Task<List<OportunidadesEnProcesoDto>> ConsultarHistoricoOportunidades(int IdEmpresa, int IdOportunidad);
        public Task<BaseOut> GuardarHistorico(OportunidadesEnProcesoDto request);
        public Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorMes(int IdUsuario, int IdEmpresa);
        public Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorEtapa(int IdUsuario, int IdEmpresa);
        public Task<BaseOut> ActualizarFechaEstimada(OportunidadesEnProcesoDto request);
        public Task<HtmlToPdfDocument> GenerarReporteSeguimientoOportunidades(int IdEmpresa, int IdOportunidad, string RutaBase);
        public Task<HtmlToPdfDocument> GenerarReporteOportunidades(OportunidadesReporteDto oportunidades, string RutaBase, string titulo);
    }
}
