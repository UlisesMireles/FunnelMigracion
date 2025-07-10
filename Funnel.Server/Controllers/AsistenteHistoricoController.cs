using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using DinkToPdf.Contracts;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils.Asistentes;
using Funnel.Data.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenteHistoricoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IProspectoData _prospectoData;

        public AsistenteHistoricoController(IConfiguration configuration, IProspectoData prospectoData)
        {
            _configuration = configuration;
            _prospectoData = prospectoData;
        }
        [HttpPost("OpenIA")]
        public async Task<ActionResult<ConsultaAsistente>> PostOpenIa(ConsultaAsistente consultaAsistente)
        {
            if (consultaAsistente == null || string.IsNullOrWhiteSpace(consultaAsistente.Pregunta))
            {
                return BadRequest("La consulta no puede estar vacía o la pregunta no puede ser nula.");
            }

            try
            {
                var asistente = new AsistenteHistorico(_configuration);
                var resultado = await asistente.AsistenteOpenAIAsync(consultaAsistente);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocurrió un error al procesar la solicitud: " + ex.Message);
            }
        }
        [HttpPost("EvaluarProspectos")]
        public async Task<IActionResult> EvaluarProspectos()
        {
            try
            {
                var asistente = new AsistenteHistorico(_configuration);
                await asistente.EvaluarProspectosYAsignarNivelAsync(_prospectoData, 1);
                return Ok("Evaluación de prospectos completada.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error durante la evaluación: {ex.Message}");
            }
        }


    }
}
