using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController : Controller
    {
        private readonly IArchivosService _archivosService;
        public ArchivosController(IArchivosService archivosService)
        {
            _archivosService = archivosService;
        }

        [HttpGet("[action]/{idOportunidad}")]
        public async Task<ActionResult<List<ArchivoDto>>> ConsultarArchivo(int idOportunidad)
        {
            var result = await _archivosService.ConsultaArchivosPorOportunidad(idOportunidad);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> GuardarArchivo(ArchivoDto request)
        {
            var result = await _archivosService.GuardarArchivo(request);
            return Ok(result);
        }

        [HttpDelete("[action]/{idArchivo}")]
        public async Task<ActionResult> EliminarArchivo(int idArchivo)
        {
            var result = await _archivosService.EliminarArchivo(idArchivo);
            return Ok(result);
        }

        [HttpPost("[action]/{idArchivo}")]
        public async Task<ActionResult> RecuperarArchivo(int idArchivo)
        {
            var result = await _archivosService.RecuperarArchivo(idArchivo);
            return Ok(result);
        }

        [HttpGet("[action]/{idOportunidad}")]
        public async Task<ActionResult<int>> ObtenerNumeroArchivosSubidos(int idOportunidad)
        {
            var result = await _archivosService.ObtenerNumeroArchivosSubidos(idOportunidad);
            return Ok(result);
        }
    }
}