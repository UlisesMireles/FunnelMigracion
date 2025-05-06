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

        public async Task<BaseOut> GuardarSolicitudRegistro(SolicitudRegistroSistemaDto datos)
        {
            BaseOut resultado = new BaseOut();
            UsuarioDto consultaCorreo;
            string nombreAdmin = "";

            consultaCorreo = await _loginData.AdministradorEmpresas();

            if (consultaCorreo != null)
            {
                nombreAdmin = consultaCorreo.Nombre.ToString();
                string correoUser = datos.Correo;
                BaseOut insertRegistro = await _loginData.SolicitudesUsuarios(datos);

                if ((bool)insertRegistro.Result)
                {
                    try
                    {
                        string cuerpoCorreoAdmin = $@"
                            <div style='font-family: Arial, sans-serif; padding: 20px;'>
                                <div style='max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;'>
                                    <p>Estimado/a <strong>{nombreAdmin}</strong>,</p>

                                    <p>Le informamos que se ha recibido una nueva solicitud de registro en el sistema. A continuación, le proporcionamos los detalles del usuario que ha solicitado el registro:</p>
            
                                    <p><strong>Datos del usuario:</strong></p>
                                    <ul style='list-style-type: none; padding-left: 0; margin: 0;'>
                                        <li style='margin-bottom: 8px;'><strong>Nombre Completo:</strong> {datos.Nombre} {datos.Apellido}</li>
                                        <li style='margin-bottom: 8px;'><strong>Correo Electrónico:</strong> {datos.Correo}</li>
                                        <li style='margin-bottom: 8px;'><strong>Teléfono:</strong> {datos.Telefono}</li>
                                        <li style='margin-bottom: 8px;'><strong>Empresa:</strong> {datos.Empresa}</li>
                                        <li style='margin-bottom: 8px;'><strong>URL del sitio web:</strong> {datos.UrlSitio}</li>
                                        <li style='margin-bottom: 8px;'><strong>Número de empleados:</strong> {datos.NoEmpleados}</li>
                                    </ul>
        
                                    <p>Atentamente,<br/>Sales Funnel System</p>
                                </div>
                            </div>";

                        bool respuestaEnvioCorreoAdmin = _correo.EnviarCorreo(consultaCorreo.Correo, "Nueva Solicitud de Registro a Sales Funnel System", cuerpoCorreoAdmin);

                        string cuerpoCorreoUser = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px;'>
                            <div style='max-width: 600px; margin: auto;  border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;'>

                                <p>Estimado/a <strong>{datos.Nombre} {datos.Apellido}</strong>,</p>

                                <p>Gracias por enviar su solicitud de registro al sistema. A continuación, le mostramos un resumen de los datos proporcionados:</p>

                                <ul style='list-style-type: none; padding-left: 0; margin: 0;'>
                                    <li style='margin-bottom: 8px;'><strong>Nombre Completo:</strong> {datos.Nombre} {datos.Apellido}</li>
                                    <li style='margin-bottom: 8px;'><strong>Correo Electrónico:</strong> {datos.Correo}</li>
                                    <li style='margin-bottom: 8px;'><strong>Teléfono:</strong> {datos.Telefono}</li>
                                    <li style='margin-bottom: 8px;'><strong>Empresa:</strong> {datos.Empresa}</li>
                                    <li style='margin-bottom: 8px;'><strong>URL del sitio web:</strong> {datos.UrlSitio}</li>
                                    <li style='margin-bottom: 8px;'><strong>Número de empleados:</strong> {datos.NoEmpleados}</li>
                                </ul>
        
                                <p>Atentamente,<br/>Sales Funnel System</p>
                            </div>
                        </div>";

                        bool respuestaEnvioCorreoUsuario = _correo.EnviarCorreo(correoUser, "Solicitud de Registro a Sales Funnel System", cuerpoCorreoUser);

                        resultado.ErrorMessage = "Tu solicitud de registro ha sido enviada al administrador del sitio. En un máximo de 24 horas tu solicitud será respondida.";
                        resultado.Result = true;

                    }
                    catch (Exception ex)
                    {
                        resultado.ErrorMessage = "Se ha presentado un error al enviar el correo de Solicitud";
                        resultado.Result = false;
                        //return resultado;
                    }

                }
                else
                {
                    resultado.ErrorMessage = "Ha ocurrido un error, inténtelo de nuevo.";
                    resultado.Result = false;
                }

            }
            else
            {
                resultado.ErrorMessage = "Ha ocurrido un error, inténtelo de nuevo.";
                resultado.Result = false;

            }
            return resultado;


        }

        public async Task<BaseOut> CambioPassword(UsuarioDto datos)
        {
            BaseOut resultado = new BaseOut();
            string passEncrypt = Encrypt.Encriptar(datos.Password);
            resultado =  await _loginData.CambioPassword("UPDATE-PASS", "","", "", "", "", null, 0, datos.IdUsuario, 1, passEncrypt, 0);

            return resultado;


        }

        public async Task<BaseOut> GuardarImagen(int idUsuario, string nombreArchivo)
        {
            return await _loginData.GuardarImagen(idUsuario, nombreArchivo);
        }

        public async Task<BaseOut> ReenviarCodigo(string correo)
        {
            return await _loginData.ReenviarCodigo(correo);
        }
    }
}
