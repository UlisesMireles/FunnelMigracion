using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using DinkToPdf.Contracts;
using Funnel.Logic;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EncuestaController : Controller
    {
        private readonly IEncuestaService _encuestaService;
        public EncuestaController(IEncuestaService encuestaService)
        {
            _encuestaService = encuestaService;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<EncuestaDto>>> ConsultarPreguntasEncuesta()
        {
            var result = await _encuestaService.ConsultarPreguntasEncuesta();
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<InsertaBitacoraPreguntasDto>> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert)
        {
            var result = await _encuestaService.InsertaPreguntaBitacoraPreguntas(insert);
            return Ok(result);
        }
    }
   
}
