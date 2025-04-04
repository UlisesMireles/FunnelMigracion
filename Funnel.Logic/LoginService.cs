using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;

namespace Funnel.Logic
{
    public class LoginService : ILoginService
    {
        private readonly ILoginData _loginData;
        private readonly Correo _correo = new Correo();
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
        public async Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario)
        {
            return await _loginData.VerificarCodigoDobleAutenticacion(usuario);
        }

        public async Task<BaseOut> ObtenerVersion()
        {
            return await _loginData.ObtenerVersion();
        }

        public async Task<BaseOut> ResetPassword(string usuario)
        {
            BaseOut resultado = new BaseOut();
            UsuarioDto informacionCorreo;

            informacionCorreo = await _loginData.ObtenerInformacionUsuario(usuario);

            if(informacionCorreo != null)
            {
                string cuerpoCorreo = await _loginData.ObtenerInformacionNotificacionCorreo("NOTIFICACION-RESET",usuario, "", "", "");
                if(cuerpoCorreo != null)
                {
                    try
                    {
                        string passDesEncrypt = Encrypt.Desencriptar(informacionCorreo.Password);
                        cuerpoCorreo = cuerpoCorreo.Replace("{Contraseña}", passDesEncrypt);
                        bool respuestaEnvioCorreo = _correo.EnviarCorreo(informacionCorreo.Correo, "Recuperación de contraseña Sistema Funnel  SFS", cuerpoCorreo);
                        resultado.ErrorMessage = "Se ha enviado tu contraseña al correo " + informacionCorreo.Correo;
                        resultado.Result = true;

                    }
                    catch (Exception ex)
                    {
                        resultado.ErrorMessage = "Se ha presentado un error al enviar el correo de recuperación de contraseña";
                        resultado.Result = false;
                        //return resultado;
                    }

                }
                else
                {
                    resultado.ErrorMessage = "Se ha presentado un error al obtener el cuerpo del correo.";
                    resultado.Result = false;
                }

            }
            else
            {
                resultado.ErrorMessage = "El usuario " + usuario + " no existe";
                resultado.Result = false;

            }
            return resultado;


        }



    }
}
