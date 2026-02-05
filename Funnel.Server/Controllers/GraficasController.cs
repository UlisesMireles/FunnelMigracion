using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
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
        public async Task<ActionResult<List<AniosDto>>> Anios(int IdEmpresa, int IdEstatusOportunidad, int IdProceso)
        {
            var respuesta = await _graficasService.Anios(IdEmpresa, IdEstatusOportunidad, IdProceso);
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

        [HttpPost("[action]/")]
        public async Task<ActionResult<List<OportunidadAgenteClienteDto>>> ObtenerOportunidadesPorAgenteClientes(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerOportunidadesPorAgenteClientes(data);
            return Ok(result);
        }
   
    [HttpPost("[action]/")]
        public async Task<ActionResult<List<TipoOportunidadAgenteDto>>> ObtenerOportunidadesPorAgenteTipo(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerOportunidadesPorAgenteTipo(data);
            return Ok(result);
        }

        [HttpPost("[action]/{idAgente}/{idTipoOporAgente}")]
        public async Task<ActionResult<List<DetalleOportunidadTipoAgenteDto>>> ObtenerDetalleOportunidadesTipoAgente(int idAgente, int idTipoOporAgente, RequestGrafica data)
        {
            var result = await _graficasService.ObtenerDetalleOportunidadesTipoAgente(idAgente, idTipoOporAgente, data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<TipoSectorAgenteDto>>> ObtenerOportunidadesPorSectorPorAgente(RequestGrafica data)
        {
            var result = await _graficasService.ObtenerOportunidadesPorSectorPorAgente(data);
            return Ok(result);
        }

        [HttpPost("[action]/{idAgente}/{idSector}")]
        public async Task<ActionResult<List<DetalleSectorAgenteDto>>> ObtenerDetallesPorSectorPorAgente(int idAgente, int idSector, RequestGrafica data)
        {
            var result = await _graficasService.ObtenerDetallesPorSectorPorAgente(idAgente, idSector, data);
            return Ok(result);
        }
    }
}
