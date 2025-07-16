using Funnel.Logic.Utils.Asistentes;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenteProspeccionController : Controller
    {
        private readonly IConfiguration _configuration;
        public AsistenteProspeccionController(IConfiguration configuration)
        {
            _configuration = configuration;
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
                var asistente = new AsistenteProspeccionInteligente(_configuration);
                var resultado = await asistente.AsistenteOpenAIAsync(consultaAsistente);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud: " + ex.Message);
            }
        }
    }
}
