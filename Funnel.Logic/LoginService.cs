using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Dto;

namespace Funnel.Logic
{
    public class LoginService : ILoginService
    {
        private readonly ILoginData _loginData;
        public LoginService(ILoginData loginData)
        {
            _loginData = loginData;
        }
        public async Task<UsuarioDto> Autenticar(string user, string contrasena)
        {
            if (!string.IsNullOrEmpty(contrasena))
                contrasena = Encrypt.Encriptar(contrasena);
            var respuesta = await _loginData.Autenticar(user, contrasena);
            return respuesta;
        }
    }
}
