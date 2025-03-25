using Azure.Core;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Security.Authentication;

namespace Funnel.Data
{
    public class PermisosData : IPermisosData
    {
        private readonly string _connectionString;
        public PermisosData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<PermisosDto>> ComboRoles(int IdEmpresa)
        {
            List<PermisosDto> result = new List<PermisosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ROLES" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_RolesPermisos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new PermisosDto();

                    dto.IdRol = ComprobarNulos.CheckIntNull(reader["IdRol"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa)
        {
            List<PermisosDto> result = new List<PermisosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-PERMISOS_ROL" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_RolesPermisos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new PermisosDto();

                    dto.IdPagina = ComprobarNulos.CheckIntNull(reader["IdPagina"]);
                    dto.IdMenu = ComprobarNulos.CheckIntNull(reader["IdMenu"]);
                    dto.Menu = ComprobarNulos.CheckStringNull(reader["Menu"]);
                    dto.Pagina = ComprobarNulos.CheckStringNull(reader["Pagina"]);
                    dto.Administrador = ComprobarNulos.CheckBooleanNull(reader["Administrador"]);
                    dto.Gerente = ComprobarNulos.CheckBooleanNull(reader["Gerente"]);
                    dto.Agente = ComprobarNulos.CheckBooleanNull(reader["Agente"]);
                    dto.Invitado = ComprobarNulos.CheckBooleanNull(reader["Invitado"]);


                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<bool> GuardarPermisos(List<PermisosDto> listPermisos)
        {
            BaseOut result = new BaseOut();
            DataTable dtPermisos = new DataTable("Permisos");

            dtPermisos.Columns.Add(new DataColumn("IdRol", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("IdPagina", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("Estatus", typeof(bool)));

            foreach (var item in listPermisos.Where(x => x.IdPagina.HasValue))
            {
                DataRow row = dtPermisos.NewRow();
                row["IdRol"] = item.IdRol ?? (object)DBNull.Value;
                row["IdPagina"] = item.IdPagina ?? (object)DBNull.Value;
                row["Estatus"] = item.Estatus ?? (object)DBNull.Value;
                dtPermisos.Rows.Add(row);
            }

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, listPermisos.FirstOrDefault()?.IdEmpresa ?? 0),
                DataBase.CreateParameterSql("@pPermisos", SqlDbType.Structured, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, dtPermisos)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_GuardarPermisos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {

                }

            }
            result.ErrorMessage = "Contacto insertado correctamente.";
            result.Id = 1;
            result.Result = true;

            return result.Result ?? false;

        }

    }
}
