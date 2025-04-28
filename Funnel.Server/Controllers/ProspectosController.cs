using DinkToPdf.Contracts;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProspectosController : Controller
    {
        private readonly IProspectosService _prospectosService;
        private readonly IConverter _converter;

        public ProspectosController(IProspectosService prospectosService, IConverter converter)
        {
            _prospectosService = prospectosService;
            _converter = converter;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarProspectos(int idEmpresa)
        {
            var respuesta = await _prospectosService.ConsultarProspectos(idEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ComboSectores()
        {
            var respuesta = await _prospectosService.ComboSectores();
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarProspecto(ProspectoDTO request)
        {
            //request.IdEmpresa = 1; //<--------de donde sale este parametro
            var respuesta = await _prospectosService.GuardarProspecto(request);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarTopVeinte(int IdEmpresa)
        {
            var respuesta = await _prospectosService.ConsultarTopVeinte(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteProspectos([FromBody] ProspectosReporteDTO prospectos)
        {
            var doc = await _prospectosService.GenerarReporteProspectos(prospectos, Directory.GetCurrentDirectory(), "Reporte de Prospectos");
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "Prospectos.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteTop20([FromBody] ProspectosReporteDTO prospectos)
        {
            var doc = await _prospectosService.GenerarReporteTop20(prospectos, Directory.GetCurrentDirectory(), "Reporte de Clientes Top 20");
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "ClientesTop20.pdf");
        }
    }
}
