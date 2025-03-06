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
    }
}
