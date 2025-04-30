using DinkToPdf.Contracts;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HerramientasController : Controller
    {
        private readonly IHerramientasService _herramientasService;
        private readonly IConverter _converter;

        public HerramientasController(IHerramientasService herramientasService, IConverter converter)
        {
            _herramientasService = herramientasService;
            _converter = converter;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ProspectoDTO>>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            var respuesta = await _herramientasService.ConsultarIngresos(IdUsuario,IdEmpresa);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteIngresosUsuarios([FromBody] IngresosFunnelReporteDTO ingresos)
        {
            var titulo = ingresos.Anio.Contains("Todos") ? "Reporte de Ingresos de Usuarios de Todos los Años" :
                "Reporte de Ingresos de Usuarios del Año " + ingresos.Anio; 

            var doc = await _herramientasService.GenerarReporteIngresosUsuarios(ingresos, Directory.GetCurrentDirectory(), titulo);
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "IngresosUsuarios.pdf");
        }
    }
}
