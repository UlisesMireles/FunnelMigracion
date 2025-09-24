using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtapasController : Controller
    {
        private readonly IEtapasService _etapasService;
        public EtapasController(IEtapasService etapasService)
        {
            _etapasService = etapasService;
        }

        [HttpPost("GuardarEtapas/")]
        public async Task<ActionResult> GuardarEtapas([FromBody] List<OportunidadesTarjetasDto> etapas)
        {
            var result = await _etapasService.GuardarEtapas(etapas);
            return Ok(result);
        }
    }
}
