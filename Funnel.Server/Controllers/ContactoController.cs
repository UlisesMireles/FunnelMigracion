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
    public class ContactoController : Controller
    {
        private readonly IContactoService _contactoService;
        private readonly IConverter _converter;
        public ContactoController(IContactoService contactoService, IConverter converter)
        {
            _contactoService = contactoService;
            _converter = converter;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ContactoDto>>> ConsultarContacto(int idEmpresa)
        {
            var result = await _contactoService.ConsultarContacto(idEmpresa);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarContacto(ContactoDto request)
        {
            var result = await _contactoService.GuardarContacto(request);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ComboProspectos(int idEmpresa)
        {
            var result = await _contactoService.ComboProspectos(idEmpresa);
            return Ok(result);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteContactos([FromBody] ContactosReporteDTO contactos)
        {
            var doc = await _contactoService.GenerarReporteContactos(contactos, Directory.GetCurrentDirectory(), "Reporte de Contactos");
            var pdf = _converter.Convert(doc);
            return File(pdf, "application/pdf", "Contactos.pdf");
        }
    }
}
