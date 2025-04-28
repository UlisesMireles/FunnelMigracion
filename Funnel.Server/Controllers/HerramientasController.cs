using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

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
    }
}
