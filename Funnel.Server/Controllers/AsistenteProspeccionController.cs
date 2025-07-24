using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils.Asistentes;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenteProspeccionController : Controller
    {
        private readonly IAsistentesService _asistentesService;
        public AsistenteProspeccionController(IConfiguration configuration, IMemoryCache cache, IAsistentesService asistentesService)
        {
            _asistentesService = asistentesService;
        }
        [HttpPost("OpenIA")]
        public async Task<ActionResult<ConsultaAsistente>> PostOpenIa(ConsultaAsistente consultaAsistente)
        {
            if (consultaAsistente == null || string.IsNullOrEmpty(consultaAsistente.Pregunta))
            {
                return BadRequest("La consulta no puede estar vacía o la pregunta no puede ser nula.");
            }

            try
            {
                var resultado = await _asistentesService.AsistenteOpenAIAsync(consultaAsistente);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud: " + ex.Message);
            }
        }
        [HttpPost("ActualizarDocsLeadsEisei")]
        public async Task<IActionResult> ActualizarDocumentoLeadsEisei(ConsultaAsistente consultaAsistente)
        {
            if (consultaAsistente == null || string.IsNullOrEmpty(consultaAsistente.IdBot.ToString()))
            {
                return BadRequest("La consulta no puede estar vacía o el idBot no puede ser nulo.");
            }
            try
            {
                var resultado = await _asistentesService.ActualizarDocumento(consultaAsistente);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud: " + ex.Message);
            }
        }
        [HttpPost("LimpiarCacheBot")]
        public IActionResult LimpiarCacheBot(int userId, int idBot)
        {
            _asistentesService.LimpiarCacheAsistente(userId, idBot);
            return Ok(new { mensaje = "Caché limpiado correctamente." });
        }
    }
}
