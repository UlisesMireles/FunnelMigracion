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
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<GraficaDto>>> ObtenerGraficaAgentes(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerGraficaAgentes(data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<AgenteDto>>> ObtenerAgentes(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerAgentes(data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<SectorDto>>> ObtenerOportunidadesPorSector(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerOportunidadesPorSector(data);
            return Ok(result);
        }

        [HttpPost("[action]/{idSector}")]
        public async Task<ActionResult<List<OportunidadSectorDto>>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data)
        {
            var result = await _graficasService.ObtenerDetalleOportunidadesSector(idSector, data);
            return Ok(result);
        }
    }
}
