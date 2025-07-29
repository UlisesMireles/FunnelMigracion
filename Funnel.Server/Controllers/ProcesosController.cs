using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcesosController : Controller
    {
        private readonly IProcesosService _procesosService;

        public ProcesosController(IProcesosService procesosService)
        {
            _procesosService = procesosService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProcesosDTO>>> ConsultarProcesos(int IdEmpresa)
        {
            var respuesta = await _procesosService.ConsultarProcesos(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<ProcesosDTO>> ConsultarEtapasPorProceso(int IdProceso)
        {
            var respuesta = await _procesosService.ConsultarEtapasPorProceso(IdProceso);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<PlantillasProcesosStageDTO>>> ConsultarPlantillasProcesosEtapas()
        {
            var respuesta = await _procesosService.ConsultarPlantillasProcesosEtapas();
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> InsertarModificarProcesoEtapa([FromBody] ProcesosDTO request)
        {
            var respuesta = await _procesosService.InsertarModificarProcesoEtapa(request);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteProcesos([FromBody] ProcesosReportesDTO procesos, int IdEmpresa)
        {
            var pdf = await _procesosService.GenerarReporteProcesos(procesos, Directory.GetCurrentDirectory(), "Reporte de Procesos", IdEmpresa);
            return File(pdf, "application/pdf", "Procesos.pdf");
        }

        [HttpGet("ConsultarComboEtapas/")]
        public async Task<ActionResult> ConsultarComboEtapas(int IdUsuario, int idEmpresa)
        {
            var result = await _procesosService.ConsultarComboEtapas(IdUsuario, idEmpresa);
            return Ok(result);
        }
    }
}
