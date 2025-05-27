using DinkToPdf.Contracts;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HerramientasController : Controller
    {
        private readonly IHerramientasService _herramientasService;

        public HerramientasController(IHerramientasService herramientasService)
        {
            _herramientasService = herramientasService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            var respuesta = await _herramientasService.ConsultarIngresos(IdUsuario,IdEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboCorreosUsuariosDTO>>> ConsultarComboCorreosUsuariosActivos(int IdEmpresa)
        {
            var respuesta = await _herramientasService.ComboCorreosUsuariosActivos(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboCorreosUsuariosDTO>>> ConsultarCorreosUsuariosReporteAuto(int IdEmpresa, int IdReporte)
        {
            var respuesta = await _herramientasService.ConsultarCorreosUsuariosReporteAuto(IdEmpresa, IdReporte);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<EjecucionProcesosReportesDTO>>> ConsultarEjecucionProcesosPorEmpresa(int IdEmpresa)
        {
            var respuesta = await _herramientasService.ConsultarEjecucionProcesosPorEmpresa(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> EnvioCorreosReporteSeguimiento([FromBody]List<string> correos, int IdEmpresa, int IdReporte)
        {
            var respuesta = await _herramientasService.EnvioCorreosReporteSeguimiento(IdEmpresa, IdReporte, correos);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarDiasReportesEstatus([FromBody]EjecucionProcesosReportesDTO request)
        {
            var respuesta = await _herramientasService.GuardarDiasReportesEstatus(request);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteIngresosUsuarios([FromBody] IngresosFunnelReporteDTO ingresos, int IdEmpresa)
        {
            var titulo = ingresos.Anio.Contains("Todos") ? "Reporte de Ingresos de Usuarios de Todos los Años" :
                "Reporte de Ingresos de Usuarios del Año " + ingresos.Anio; 

            var pdf = await _herramientasService.GenerarReporteIngresosUsuarios(ingresos, Directory.GetCurrentDirectory(), titulo, IdEmpresa);            
            return File(pdf, "application/pdf", "IngresosUsuarios.pdf");
        }
    }
}
