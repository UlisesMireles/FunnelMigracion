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
        public OportunidadesController(IOportunidadesEnProcesoService oportunidadesService)
        {
            _oportunidadesService = oportunidadesService;
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
    }
}
