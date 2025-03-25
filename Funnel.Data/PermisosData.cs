using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Funnel.Data
{
    public class PermisosData : IPermisosData
    {
        private readonly string _connectionString;
        public PermisosData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
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
                    dto.Administrador = ComprobarNulos.CheckStringNull(reader["Administrador"]);
                    dto.Gerente = ComprobarNulos.CheckStringNull(reader["Gerente"]);
                    dto.Agente = ComprobarNulos.CheckStringNull(reader["Agente"]);
                    dto.Invitado = ComprobarNulos.CheckStringNull(reader["Invitado"]);


                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
