using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProspectosController : Controller
    {
        private readonly IProspectosService _prospectosService;

        public ProspectosController(IProspectosService prospectosService)
        {
            _prospectosService = prospectosService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarProspectos()
        {
            int idEmpresa = 1; //<--------de donde sale este parametro
            var respuesta = await _prospectosService.ConsultarProspectos(idEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ComboSectores()
        {
            var respuesta = await _prospectosService.ComboSectores();
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarProspecto(ProspectoDTO request)
        {
            request.IdEmpresa = 1; //<--------de donde sale este parametro
            var respuesta = await _prospectosService.GuardarProspecto(request);
            return Ok(respuesta);
        }
    }
}
