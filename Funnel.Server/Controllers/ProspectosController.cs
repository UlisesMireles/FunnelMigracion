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

        public ProspectosController(IProspectosService prospectosService)
        {
            _prospectosService = prospectosService;
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
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarTopVeinte(int IdEmpresa, string Anio = "")
        {
            var respuesta = await _prospectosService.ConsultarTopVeinte(IdEmpresa, Anio);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<AniosDto>>> ConsultarAniosOportunidades(int IdEmpresa, int IdProceso)
        {
            var respuesta = await _prospectosService.ConsultarAniosOportunidades(IdEmpresa, IdProceso);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<AniosDto>>> ConsultarAniosGraficas(int IdEmpresa)
        {
            var respuesta = await _prospectosService.ConsultarAniosGraficas(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteProspectos([FromBody] ProspectosReporteDTO prospectos, int IdEmpresa)
        {
            var pdf = await _prospectosService.GenerarReporteProspectos(prospectos, Directory.GetCurrentDirectory(), "Reporte de Prospectos", IdEmpresa);
            return File(pdf, "application/pdf", "Prospectos.pdf");
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteTop20([FromBody] ProspectosReporteDTO prospectos, int IdEmpresa)
        {
            var titulo = prospectos.Anio.Contains("Todos") ? "Reporte Top 20 de clientes de Todos los Años" :
               "Reporte Top 20 de clientes del Año " + prospectos.Anio;

            var pdf = await _prospectosService.GenerarReporteTop20(prospectos, Directory.GetCurrentDirectory(), titulo, IdEmpresa);
            return File(pdf, "application/pdf", "ClientesTop20.pdf");
        }
    }
}
