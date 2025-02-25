using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
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
                using (IDataReader reader = await DataBase.GetReaderSql("F_AutentificacionTenantDosPasos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        usuario.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                        usuario.TipoUsuario = "Tenant";
                        usuario.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                        usuario.Correo = ComprobarNulos.CheckStringNull(reader["Correo"]);
                        usuario.Result = ComprobarNulos.CheckBooleanNull(reader["Result"]);
                        usuario.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                    }
                }
            }
            catch (Exception ex)
            {
                usuario.Result = false;
                usuario.ErrorMessage = ex.Message;
            }
            return usuario;
        }

    }
}
