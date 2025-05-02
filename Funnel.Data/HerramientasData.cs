using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class HerramientasData : IHerramientasData
    {
        private readonly string _connectionString;
        public HerramientasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<IngresosFunnelDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            List<IngresosFunnelDTO> result = new List<IngresosFunnelDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT" ),
                    DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdUsuario ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_IngresosFunnel", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new IngresosFunnelDTO();
                    dto.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]);
                    dto.Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]);
                    dto.FechaIngreso = ComprobarNulos.CheckDateTimeNull(reader["FechaIngreso"]);

                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
