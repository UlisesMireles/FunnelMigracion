﻿using Funnel.Data.Interfaces;
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
                    DataBase.CreateParameter("@pUsuario", DbType.String, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario.Usuario),
                    DataBase.CreateParameter("@pCodigo", DbType.String, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, usuario.Codigo),
                };
                using (IDataReader reader = await DataBase.GetReader("F_CodigoAutentificacionFunnel", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        dobleAutenticacion.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        dobleAutenticacion.ErrorMessage = ComprobarNulos.CheckStringNull(reader["ErrorMessage"]);
                        dobleAutenticacion.TipoMensaje = ComprobarNulos.CheckIntNull(reader["TipoMensaje"]);
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
    }
}
