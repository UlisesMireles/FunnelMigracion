using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class UsuarioData : IUsuarioData
    {
        private readonly string _connectionString;

        public UsuarioData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<ComboTiposUsuariosDto>> ComboTiposUsuarios()
        {
            List<ComboTiposUsuariosDto> result = new List<ComboTiposUsuariosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-TIPOUSUARIO"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboTiposUsuariosDto();
                    dto.IdTipoUsuario = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<UsuarioDto>> ConsultarUsuarios(int IdEmpresa)
        {
            List<UsuarioDto> result = new List<UsuarioDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new UsuarioDto
                    {
                        IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]),
                        Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                        ApellidoPaterno = ComprobarNulos.CheckStringNull(reader["ApellidoPaterno"]),
                        ApellidoMaterno = ComprobarNulos.CheckStringNull(reader["ApellidoMaterno"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        IdTipoUsuario = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]),
                        CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]),
                        Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]),
                        NumOportunidades = ComprobarNulos.CheckIntNull(reader["NumOportunidades"]),
                        DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]),
                        TipoUsuario = ComprobarNulos.CheckStringNull(reader["TipoUsuario"]),
                        Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]),
                    };
                    result.Add(dto);
                }
            }
            return result;
        }


        public async Task<BaseOut> GuardarUsuarios(UsuarioDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
        {
            DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@ApellidoPaterno", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoPaterno ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@ApellidoMaterno", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoMaterno ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@Usuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Usuario ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@Password", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Password ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@Iniciales", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Iniciales ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@CorreoElectronico", SqlDbType.VarChar, 300, ParameterDirection.Input, false, null, DataRowVersion.Default, request.CorreoElectronico ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@IdTipoUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdTipoUsuario),
            DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
            DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Estatus),
        };


                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Servicio insertado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Servicio actualizado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    default:
                        result.ErrorMessage = "Operación no válida.";
                        result.Id = 0;
                        result.Result = false;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Error al insertar servicio: " + ex.Message;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Error al actualizar servicio: " + ex.Message;
                        break;
                    default:
                        result.ErrorMessage = "Error desconocido: " + ex.Message;
                        break;
                }
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }
    }
}
