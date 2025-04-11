using DinkToPdf.Contracts;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OportunidadesController : Controller
    {
        private readonly IOportunidadesEnProcesoService _oportunidadesService;
        private readonly IConverter _converter;
        public OportunidadesController(IOportunidadesEnProcesoService oportunidadesService, IConverter converter)
        {
            _oportunidadesService = oportunidadesService;
            _converter = converter;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<OportunidadesEnProcesoDto>>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus)
        {
            var result = await _oportunidadesService.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, IdEstatus);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            var result = await _oportunidadesService.GuardarOportunidad(request);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboProspectos(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboProspectos(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboServicios(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboServicios(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboEtapas(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboEtapas(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboEntregas(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboEntregas(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboEjecutivos(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboEjecutivos(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboContactos(int idEmpresa, int idProspecto)
        {
            var result = await _oportunidadesService.ComboContactos(idEmpresa, idProspecto);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboTipoOportunidad(int idEmpresa)
        {
            var result = await _oportunidadesService.ComboTipoOportunidad(idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ConsultarHistoricoOportunidades(int idEmpresa, int idOportunidad)
        {
            var result = await _oportunidadesService.ConsultarHistoricoOportunidades(idEmpresa, idOportunidad);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarHistorico(OportunidadesEnProcesoDto request)
        {
            var result = await _oportunidadesService.GuardarHistorico(request);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ConsultarOportunidadesPorMes(int IdUsuario, int idEmpresa )
        {
            var result = await _oportunidadesService.ConsultarOportunidadesPorMes(IdUsuario, idEmpresa);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ConsultarOportunidadesPorEtapa(int IdUsuario, int idEmpresa )
        {
            var result = await _oportunidadesService.ConsultarOportunidadesPorEtapa(IdUsuario, idEmpresa);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> ActualizarFechaEstimada(OportunidadesEnProcesoDto request)
        {
            var result = await _oportunidadesService.ActualizarFechaEstimada(request);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> DescargarReporteSeguimientoOportunidades(int idEmpresa, int idOportunidad)
        {
            var doc = await _oportunidadesService.GenerarReporteSeguimientoOportunidades(idEmpresa, idOportunidad, Directory.GetCurrentDirectory());
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "SeguimientoOportunidades.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesEnProceso(OportunidadesReporteDto oportunidades)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(),"Reporte de Oportunidades en Proceso");
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesEnProceso.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesPorEtapa(OportunidadesReporteDto oportunidades)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(),"Reporte de Oportunidades por Etapa");
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesPorEtapa.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesGanadas([FromBody]OportunidadesReporteDto oportunidades, int anio)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(), "Reporte de Oportunidades Ganadas del Año "+anio);
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesGanadas.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesPerdidas([FromBody] OportunidadesReporteDto oportunidades, int anio)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(), "Reporte de Oportunidades Perdidas del Año " + anio);
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesPerdidas.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesCanceladas([FromBody] OportunidadesReporteDto oportunidades, int anio)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(), "Reporte de Oportunidades Canceladas del Año " + anio);
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesCanceladas.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteOportunidadesEliminadas([FromBody] OportunidadesReporteDto oportunidades, int anio)
        {
            var doc = await _oportunidadesService.GenerarReporteOportunidades(oportunidades, Directory.GetCurrentDirectory(), "Reporte de Oportunidades Eliminadas del Año " + anio);
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "OportunidadesEliminadas.pdf");
        }
    }
}
