using Funnel.Logic.Interfaces;
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

    }
}
