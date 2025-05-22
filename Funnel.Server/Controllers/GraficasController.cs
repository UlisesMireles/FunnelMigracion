using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraficasController : Controller
    {
        private readonly IGraficasService _graficasService;
        public GraficasController(IGraficasService graficasService)
        {
            _graficasService = graficasService;
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<GraficaDto>>> ObtenerGraficaOportunidades(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerGraficaOportunidades(data);
            return Ok(result);
        }

    }
}
