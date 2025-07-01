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
        public ContactoController(IContactoService contactoService)
        {
            _contactoService = contactoService;
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
        public async Task<ActionResult> DescargarReporteContactos([FromBody] ContactosReporteDTO contactos, int IdEmpresa)
        {
            var pdf = await _contactoService.GenerarReporteContactos(contactos, Directory.GetCurrentDirectory(), "Reporte de Contactos", IdEmpresa);
            return File(pdf, "application/pdf", "Contactos.pdf");
        }
    }
}
