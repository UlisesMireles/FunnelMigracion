using DinkToPdf.Contracts;
using Funnel.Data;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Funnel.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TiposEntregaController : Controller
    {
        private readonly ITiposEntregaService _tiposEntregaService;

        public TiposEntregaController(ITiposEntregaService tiposEntregaService)
        {
            _tiposEntregaService = tiposEntregaService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<TipoEntregaDto>>> ConsultarTiposEntrega(int idEmpresa)
        {
            var result = await _tiposEntregaService.ConsultarTiposEntrega(idEmpresa);
            return Ok(result);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarTipoEntrega(TipoEntregaDto request)
        {
            var result = await _tiposEntregaService.GuardarTipoEntrega(request);
            return Ok(result);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteTiposEntregas([FromBody] TiposEntregasReporteDTO tiposEntregas, int IdEmpresa)
        {
            var pdf = await _tiposEntregaService.GenerarReporteTiposEntregas(tiposEntregas, Directory.GetCurrentDirectory(), "Reporte de Tipos de Entregas", IdEmpresa);
            return File(pdf, "application/pdf", "TiposDeEntregas.pdf");
        }
    }
}