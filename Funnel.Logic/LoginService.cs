using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            DobleAutenticacionDto datos = await _loginData.VerificarCodigoDobleAutenticacion(usuario);

            if (datos.TipoMensaje == 1)
            {
                UsuarioDto consultaCorreo = await _loginData.AdministradorEmpresas();

                if (consultaCorreo != null)
                {
                    string cuerpoCorreoAdmin = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <div style='max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;'>
                            <p>Estimado/a <strong>{consultaCorreo.Nombre}</strong>,</p>
                            <p>Le informamos que se ha recibido una nueva solicitud de registro en el sistema.</p>

                            <p>El correo <strong>{datos.Correo}</strong> ha completado la verificación de su correo electrónico correctamente.</p>
                            <p>A continuación, le enviamos los datos del usuario solicitante:</p>
                            <ul style='list-style-type: none; padding-left: 0; margin: 0;'>
                                <li><strong>Nombre completo:</strong> {datos.Nombre} {datos.Apellidos}</li>
                                <li><strong>Correo electrónico:</strong> {datos.Correo}</li>
                                <li><strong>Teléfono:</strong> {datos.Telefono}</li>
                                <li><strong>Empresa:</strong> {datos.Empresa}</li>
                                <li><strong>URL del sitio web:</strong> {datos.SitioWeb}</li>
                                <li><strong>Número de empleados:</strong> {datos.NumEmpleados}</li>
                            </ul>
                            <p>Atentamente,<br/>Sales Funnel System</p>
                        </div>
                    </div>";

                    _correo.EnviarCorreo(consultaCorreo.Correo, "Nueva Solicitud de Registro a Sales Funnel System", cuerpoCorreoAdmin);

                    string cuerpoCorreoUsuario = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <div style='max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;'>
                            <p>Estimado/a <strong>{datos.Nombre} {datos.Apellidos}</strong>,</p>
                            <p>Gracias por enviar su solicitud de registro.</p>
                            <p>Tu solicitud de registro ha sido enviada. Será respondida en un máximo de 24 horas.. A continuación, el resumen de tú información:</p>

                            <ul style='list-style-type: none; padding-left: 0; margin: 0;'>
                                <li><strong>Nombre Completo:</strong> {datos.Nombre} {datos.Apellidos}</li>
                                <li><strong>Correo Electrónico:</strong> {datos.Correo}</li>
                                <li><strong>Teléfono:</strong> {datos.Telefono}</li>
                                <li><strong>Empresa:</strong> {datos.Empresa}</li>
                                <li><strong>URL del sitio web:</strong> {datos.SitioWeb}</li>
                                <li><strong>Número de empleados:</strong> {datos.NumEmpleados}</li>
                            </ul>
                            <p>Atentamente,<br/>Sales Funnel System</p>
                        </div>
                    </div>";

                    _correo.EnviarCorreo(datos.Correo, "Solicitud de Registro a Sales Funnel System", cuerpoCorreoUsuario);

                    datos.ErrorMessage = "Tu solicitud de registro ha sido enviada. Será respondida en un máximo de 24 horas.";
                }
                else
                {
                    datos.Result = false;
                    datos.ErrorMessage = "No se pudo obtener información del administrador.";
                }
            }
            else
            {
                datos.ErrorMessage = "Código de verificación inválido o ya vencido.";
            }

            return datos;
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
            return await _loginData.SolicitudesUsuarios(datos);
        }

        public async Task<BaseOut> CambioPassword(UsuarioDto datos)
        {
            BaseOut resultado = new BaseOut();
            string passEncrypt = Encrypt.Encriptar(datos.Password);
            resultado =  await _loginData.CambioPassword("UPDATE-PASS", "","", "", "", "", null, 0, datos.IdUsuario, 1, passEncrypt, 0);

            return resultado;


        }

        public async Task<BaseOut> GuardarImagen(int idUsuario, IFormFile imagen, UsuarioDto request)
        {
            return await _loginData.GuardarImagen(idUsuario, imagen, request);
        }

        public async Task<BaseOut> ReenviarCodigo(string correo)
        {
            return await _loginData.ReenviarCodigo(correo);
        }
        public async Task<BaseOut> RegistrarIngresoUsuario(string Bandera, int IdUsuario, int IdEmpresa, string SesionId, string MotivoCierre, string Ip)
        {
            await Task.Delay(1);
            string _SesionId = Bandera == "INSERT" ? Encrypt.Encriptar(string.Concat(IdUsuario.ToString(), '_', DateTime.Now.ToString())) : SesionId;

            return await _loginData.RegistrarIngresoUsuario(Bandera, IdUsuario, IdEmpresa, _SesionId, MotivoCierre, Ip);
        }
        public async Task<EmpresaDTO> ObtenerImagenEmpresa(int IdEmpresa)
        {
            return await _loginData.ObtenerImagenEmpresa(IdEmpresa);
        }
        public async Task<UsuarioDto> ObtenerPermitirDecimales(int idEmpresa)
        {
            var respuesta = await _loginData.ObtenerPermitirDecimales(idEmpresa);
            return respuesta;
        }

    }
}
