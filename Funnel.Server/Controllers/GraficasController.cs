using Funnel.Logic;
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
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<AniosDto>>> Anios(int IdEmpresa, int IdEstatusOportunidad)
        {
            var respuesta = await _graficasService.Anios(IdEmpresa, IdEstatusOportunidad);
            return Ok(respuesta);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<GraficaDto>>> ObtenerGraficaGanadasAnio(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerGraficaGanadasAnio(data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<AgenteDto>>> ObtenerAgentesPorAnio(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerAgentesPorAnio(data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<GraficaDto>>> ObtenerGraficaAgentesPorAnio(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerGraficaAgentesPorAnio(data);
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

        [HttpPost("[action]/")]
        public async Task<ActionResult<List<TipoProyectoDto>>> ObtenerOportunidadesPorTipo(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerOportunidadesPorTipo(data);
            return Ok(result);
        }

        [HttpPost("[action]/{idTipoProyecto}")]
        public async Task<ActionResult<List<OportunidadTipoDto>>> ObtenerDetalleOportunidadesTipo(int idTipoProyecto, RequestGrafica data)
        {
            var result = await _graficasService.ObtenerDetalleOportunidadesTipo(idTipoProyecto, data);
            return Ok(result);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<List<GraficaDto>>> ObtenerGraficaClientesTopVeinte(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerGraficaClientesTopVeinte(data);
            return Ok(result);
        }
    }
}
