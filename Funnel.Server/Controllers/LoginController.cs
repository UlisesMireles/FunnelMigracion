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
                HttpContext.Session.SetString("User", usr.Usuario);
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

        [HttpPost("CambioPassword")]
        public async Task<ActionResult<BaseOut>> CambioPassword([FromForm] UsuarioDto datos)
        {
            if (datos.Imagen != null)
            {
                var fileName = Path.GetFileName(datos.Imagen.FileName);

                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Fotografia", fileName);

                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await datos.Imagen.CopyToAsync(fileStream);
                }

                datos.ArchivoImagen = fileName;
                var respuestaImagen = await _loginService.GuardarImagen(datos.IdUsuario, datos.ArchivoImagen);
                if (respuestaImagen.Result == false)
                {
                    return Ok(respuestaImagen);
                }
                else if(respuestaImagen.Result == true && (datos.Password == "" || datos.Password is null))
                {
                    return Ok(respuestaImagen);
                }
                else
                {
                    var respuestaPassword = await _loginService.CambioPassword(datos);
                    return Ok(respuestaPassword);
                }
            }
            else
            {
                return Ok(await _loginService.CambioPassword(datos));
            }
        }
    }
}
