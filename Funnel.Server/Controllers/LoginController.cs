using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILoginService _loginService;
        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<UsuarioDto>> Autenticacion(UsuarioLoginDto usr)
        {
            var respuesta = await _loginService.Autenticar(usr.Usuario, usr.Password);
            if (respuesta.IdUsuario > 0)
            {
                HttpContext.Session.SetString("User", usr.Usuario);
                if (respuesta.Result == true && respuesta.IdEmpresa != null)
                    await _loginService.RegistrarIngresoUsuario(respuesta.IdUsuario, (int)respuesta.IdEmpresa);
            }
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> RecuperarContrasena(string usuario)
        {
            var respuesta = await _loginService.ResetPassword(usuario);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok("Sesión cerrada.");
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> ObtenerVersion()
        {
            var respuesta = await _loginService.ObtenerVersion();
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<DobleAutenticacionDto>> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario)
        {
            var respuesta = await _loginService.VerificarCodigoDobleAutenticacion(usuario);
            return Ok(respuesta);
        }

        [HttpPost("GuardarSolicitudRegistro/")]
        public async Task<ActionResult<BaseOut>> GuardarSolicitudRegistro(SolicitudRegistroSistemaDto datos)
        {
            var respuesta = await _loginService.GuardarSolicitudRegistro(datos);
            return Ok(respuesta);
        }

        [HttpPost("ReenviarCodigo/")]
        public async Task<ActionResult<BaseOut>> ReenviarCodigo(string correo)
        {
            var respuesta = await _loginService.ReenviarCodigo(correo);
            return Ok(respuesta);
        }
        [HttpPost("CambioPassword")]
        public async Task<ActionResult<BaseOut>> CambioPassword([FromForm] UsuarioDto datos)
        {
            if (datos.Imagen != null)
            {
                var respuestaImagen = await _loginService.GuardarImagen(datos.IdUsuario, datos.Imagen, datos);

                if (respuestaImagen.Result == false)
                {
                    return Ok(respuestaImagen);
                }
            }

            if (string.IsNullOrEmpty(datos.Password))
            {
                return Ok(datos.Imagen == null
                    ? await _loginService.GuardarImagen(datos.IdUsuario, null, datos)
                    : new BaseOut { Result = true });
            }

            return Ok(await _loginService.CambioPassword(datos));
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<BaseOut>> ObtenerImagenEmpresa(int IdEmpresa)
        {
            var respuesta = await _loginService.ObtenerImagenEmpresa(IdEmpresa);
            return Ok(respuesta);
        }
    }
}