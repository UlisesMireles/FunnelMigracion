using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Funnel.Data
{
    public class LoginData : ILoginData
    {
        private readonly string _connectionString;
        public LoginData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<UsuarioDto> Autenticar(string user, string contrasena)
        {
            UsuarioDto usuario = new UsuarioDto();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.NVarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, user),
                    DataBase.CreateParameterSql("@pPassword", SqlDbType.NVarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, contrasena)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_AutentificacionFunnelDosPasos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        usuario.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]);
                        usuario.Usuario = user;
                        usuario.TipoUsuario = ComprobarNulos.CheckStringNull(reader["TipoUsuario"]);
                        usuario.Password = contrasena;
                        usuario.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                        usuario.Correo = ComprobarNulos.CheckStringNull(reader["Correo"]);
                        usuario.IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"]);
                        usuario.IdRol = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]);
                        usuario.Alias = ComprobarNulos.CheckStringNull(reader["Alias"]);
                        usuario.Id = ComprobarNulos.CheckIntNull(reader["Respuesta"]);
                        usuario.ArchivoImagen = ComprobarNulos.CheckStringNull(reader["ArchivoImagen"]);
                        usuario.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                        usuario.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                    }
                }
            }
            catch (Exception ex)
            {
                usuario.Result = false;
                usuario.ErrorMessage = "Ocurrio un Error de Base de datos:" + ex.Message;
            }
            return usuario;
        }
        public async Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario)
        {
            DobleAutenticacionDto dobleAutenticacion = new DobleAutenticacionDto();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pCorreo", DbType.String, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario.Usuario),
                    DataBase.CreateParameter("@pCodigo", DbType.String, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario.Codigo),
                };
                using (IDataReader reader = await DataBase.GetReader("F_CodigoValidacionCorreoFunnel", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        dobleAutenticacion.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        dobleAutenticacion.ErrorMessage = ComprobarNulos.CheckStringNull(reader["ErrorMessage"]);
                        dobleAutenticacion.TipoMensaje = ComprobarNulos.CheckIntNull(reader["TipoMensaje"]);
                        dobleAutenticacion.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                        dobleAutenticacion.Apellidos = ComprobarNulos.CheckStringNull(reader["Apellidos"]);
                        dobleAutenticacion.Correo = ComprobarNulos.CheckStringNull(reader["Correo"]);
                        dobleAutenticacion.Telefono = ComprobarNulos.CheckStringNull(reader["Telefono"]);
                        dobleAutenticacion.Empresa = ComprobarNulos.CheckStringNull(reader["Empresa"]);
                        dobleAutenticacion.SitioWeb = ComprobarNulos.CheckStringNull(reader["SitioWeb"]);
                        dobleAutenticacion.NumEmpleados = ComprobarNulos.CheckStringNull(reader["NumEmpleados"]);
                    }
                }
            }
            catch (Exception ex)
            {
                dobleAutenticacion.Result = false;
                dobleAutenticacion.ErrorMessage = ex.Message;
            }

            return dobleAutenticacion;
        }
        public async Task<BaseOut> ObtenerVersion()
        {
            BaseOut version = new BaseOut();
            using (IDataReader reader = await DataBase.GetReader("spObtenerVersion", CommandType.StoredProcedure, _connectionString))
            {
                while (reader.Read())
                {
                    version.Result = true;
                    version.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Version"]);
                }
            }
            return version;
        }

        public async Task<UsuarioDto> ObtenerInformacionUsuario(string usuario)
        {
            UsuarioDto informacionUsuario = new UsuarioDto();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {

                    DataBase.CreateParameterSql("@pBandera", SqlDbType.NVarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, "USUARIO-BY-USERNAME"),
                    DataBase.CreateParameterSql("@Usuario", SqlDbType.NVarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        informacionUsuario.Password = ComprobarNulos.CheckStringNull(reader["Password"]);
                        informacionUsuario.Correo = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    }
                }
            }
            catch (Exception ex)
            {
                informacionUsuario.Result = false;
                informacionUsuario.ErrorMessage = "Ocurrio un Error de Base de datos:" + ex.Message;
            }
            return informacionUsuario;
        }

        public async Task<string> ObtenerInformacionNotificacionCorreo(string bandera, string usuario, string nombre, string apellidoPat, string apellidoMat)
        {
            string cuerpoCorreo = "";
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {

                    DataBase.CreateParameterSql("@pBandera", SqlDbType.NVarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, bandera),
                    DataBase.CreateParameterSql("@pUsuario", SqlDbType.NVarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.NVarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, nombre),
                    DataBase.CreateParameterSql("@pApellidoPat", SqlDbType.NVarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, apellidoPat),
                    DataBase.CreateParameterSql("@pApellidoMat", SqlDbType.NVarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, apellidoMat)
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_NotificacionCorreo", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        cuerpoCorreo = ComprobarNulos.CheckStringNull(reader["CuerpoCorreo"]);
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return cuerpoCorreo;
        }

        public async Task<UsuarioDto> AdministradorEmpresas()
        {
            UsuarioDto informacionUsuario = new UsuarioDto();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {

                    DataBase.CreateParameterSql("@pBandera", SqlDbType.NVarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "CONSULTA-ADMINISTRADOR"),
                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSuperAdmin", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        informacionUsuario.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                        informacionUsuario.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                        informacionUsuario.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                        informacionUsuario.Correo = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                        informacionUsuario.Clave = ComprobarNulos.CheckStringNull(reader["Clave"]);
                        informacionUsuario.FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaCreacion"]);
                        informacionUsuario.FechaModificacion = ComprobarNulos.CheckDateTimeNull(reader["FechaModificacion"]);
                        informacionUsuario.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                        informacionUsuario.SuperAdministrador = ComprobarNulos.CheckIntNull(reader["SuperAdministrador"]);
                        informacionUsuario.CodigoAutenticacion = ComprobarNulos.CheckStringNull(reader["CodigoAutenticacion"]);
                        informacionUsuario.FechaInicio = ComprobarNulos.CheckDateTimeNull(reader["FechaInicio"]);
                        informacionUsuario.FechaFin = ComprobarNulos.CheckDateTimeNull(reader["FechaFin"]);
                    }
                }
            }
            catch (Exception ex)
            {
                informacionUsuario.Result = false;
                informacionUsuario.ErrorMessage = "Ocurrio un Error de Base de datos:" + ex.Message;
            }
            return informacionUsuario;
        }

        public async Task<BaseOut> SolicitudesUsuarios(SolicitudRegistroSistemaDto datos)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, "INSERTAR"),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, datos.Nombre),
                    DataBase.CreateParameterSql("@pApellidos", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, datos.Apellido),
                    DataBase.CreateParameterSql("@pCorreo", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, datos.Correo),
                    DataBase.CreateParameterSql("@pTelefono", SqlDbType.VarChar, 30, ParameterDirection.Input, false,null, DataRowVersion.Default, datos.Telefono),
                    DataBase.CreateParameterSql("@pEmpresa", SqlDbType.VarChar, 200, ParameterDirection.Input, false,null, DataRowVersion.Default, datos.Empresa),
                    DataBase.CreateParameterSql("@pSitioWeb", SqlDbType.VarChar, 200, ParameterDirection.Input, false,null, DataRowVersion.Default, datos.UrlSitio),
                    DataBase.CreateParameterSql("@pNumEmpleados", SqlDbType.VarChar, 50, ParameterDirection.Input, false,null, DataRowVersion.Default, datos.NoEmpleados)
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_SolicitudesUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                result.ErrorMessage = "";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar la solicitud de usuario: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }

        public async Task<BaseOut> ReenviarCodigo(string correo)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, "REENVIAR-CODIGO"),
                    DataBase.CreateParameterSql("@pCorreo", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, correo),
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_SolicitudesUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        result.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                        result.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
          
                    }
                }
                result.ErrorMessage = "";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar la solicitud de usuario: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }

        public async Task<BaseOut> GuardarImagen(int idUsuario, string nombreArchivo)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, "UPDATE-FOTO"),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, idUsuario),
                    DataBase.CreateParameterSql("@NombreArchivo", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, nombreArchivo)
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                result.ErrorMessage = "Se ha actualizado la fotografía correctamente.";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar la imagen del usuario: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }

        public async Task<BaseOut> CambioPassword(string bandera, string Nombre, string ApellidoPaterno, string ApellidoMaterno,
            string Usuario, string Inicales, string CorreoElectronico, int IdTipoUsuario, int IdUsuario, int Estatus, string password, int idEmpresa)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, bandera),
                    DataBase.CreateParameterSql("@Password", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, password),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, IdUsuario),
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                result.ErrorMessage = "Usuario actualizado correctamente.";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Ha ocurrido un error al actualizar la contraseña. " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }
    }
}
