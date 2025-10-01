using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using Funnel.Logic;
namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreguntasFrecuentesController : ControllerBase
    {
        private readonly IPreguntasFrecuentesService _preguntasFrecuentesService;

        public PreguntasFrecuentesController(IPreguntasFrecuentesService preguntasFrecuentesService)
        {
            _preguntasFrecuentesService = preguntasFrecuentesService;
        }

        [HttpGet("PreguntasFrecuentes")]
        public async Task<ActionResult<ListaPreguntasFrecuentesDto>> PreguntasFrecuentes()
            => Ok(await _preguntasFrecuentesService.PreguntasFrecuentes());

        [HttpGet("PreguntasFrecuentesPorId/{id}")]
        public async Task<ActionResult<PreguntasFrecuentesDto>> PreguntasFrecuentesPorId(int id)
            => Ok(await _preguntasFrecuentesService.PreguntasFrecuentesPorId(id));

     
        //[HttpPost("GeneraConsulta")]
        //public async Task<ActionResult<GeneraConsultaDto>> GeneraConsulta(GeneraConsultaDto dto)
        //   => Ok(await _preguntasFrecuentesService.GeneraConsulta(dto));

        [HttpGet("ListaPreguntasFrecuentesCategoria")]
        public async Task<ActionResult<ListaPreguntasFrecuentesDto>> ListaPreguntasFrecuentesCategoria()
            => Ok(await _preguntasFrecuentesService.ListaPreguntasFrecuentesCategoria());
    }
}
