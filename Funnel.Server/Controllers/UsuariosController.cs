using DinkToPdf.Contracts;
using Funnel.Data;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly IUsuariosService _usuariosService;
        private readonly IConverter _converter;

        public UsuariosController(IUsuariosService usuariosService, IConverter converter)
        {
            _usuariosService = usuariosService;
            _converter = converter;
        }

        [HttpGet("[action]/{IdEmpresa}")]
        public async Task<ActionResult<List<UsuarioDto>>> ConsultarUsuarios(int IdEmpresa)
        {
            var respuesta = await _usuariosService.ConsultarUsuarios(IdEmpresa);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboTiposUsuariosDto>>> ComboTiposUsuarios()
        {
            var respuesta = await _usuariosService.ComboTiposUsuarios();
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ComboPuestosDto>>> ComboPuestos()
        {
            var respuesta = await _usuariosService.ComboPuestos();
            return Ok(respuesta);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<UsuarioDto>> GuardarImagen([FromForm] List<IFormFile> imagen, [FromForm] UsuarioDto request)
        {
            var result = await _usuariosService.GuardarImagen(imagen, request);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<BaseOut>> GuardarUsuario(UsuarioDto request)

        {
            var resultado = await _usuariosService.GuardarUsuarios(request);
            return Ok(resultado);

        }

        [HttpGet("validar-iniciales")]
        public async Task<ActionResult<bool>> ValidarInicialesExistente(string iniciales, int idEmpresa)
        {
            var existenIniciales = await _usuariosService.ValidarInicialesExistente(iniciales, idEmpresa);
            return Ok(existenIniciales);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult> DescargarReporteUsuarios([FromBody] UsuariosReporteDTO usuarios, int IdEmpresa)
        {
            var pdf = await _usuariosService.GenerarReporteUsuarios(usuarios, Directory.GetCurrentDirectory(), "Reporte de Usuarios", IdEmpresa);
            return File(pdf, "application/pdf", "Usuarios.pdf");
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> ValidacionCorreoRegitro(string correo)
        {
            var respuesta = await _usuariosService.ValidacionCorreoRegitro(correo);
            return Ok(respuesta);
        }
    }
}
