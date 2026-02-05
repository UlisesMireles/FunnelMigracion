
using Funnel.Data.Interfaces;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenteOperacionController : Controller
    {
        private readonly IAsistentesService _asistentesService;

        public AsistenteOperacionController(IAsistentesService asistentesService)
        {
            _asistentesService = asistentesService;
        }
        [HttpPost("AsistenteOperacion")]
        public async Task<ActionResult<ConsultaAsistente>> AsistenteOperacion(ConsultaAsistente consultaAsistente)
        {
            if (consultaAsistente == null || string.IsNullOrWhiteSpace(consultaAsistente.Pregunta))
            {
                return BadRequest("La consulta no puede estar vacía o la pregunta no puede ser nula.");
            }
            try
            {
                var resultado = await _asistentesService.AsistenteOperacionAsync(consultaAsistente);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud: " + ex.Message);
            }
        }
    }
}
