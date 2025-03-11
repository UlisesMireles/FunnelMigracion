using Funnel.Data;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
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

        public UsuariosController(IUsuariosService usuariosService)
        {
            _usuariosService = usuariosService;
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

        [HttpPost("[action]")]
        public async Task<ActionResult<BaseOut>> GuardarUsuario(UsuarioDto request)

        {
            var resultado = await _usuariosService.GuardarUsuarios(request);
            return Ok(resultado);

        }

    }
}
