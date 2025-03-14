using Microsoft.Extensions.Configuration;
using Funnel.Models.Base;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using System.Data;
using Funnel.Models.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class OportunidadesPerdidasData : IOportunidadesPerdidasData
    {
        private readonly string _connectionString;

        public OportunidadesPerdidasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<OportunidadesPerdidasDto>> ObtenerOportunidadesPerdidas(int idUsuario, int idEstatusOportunidad, int idEmpresa)
        {
            List<OportunidadesPerdidasDto> result = new List<OportunidadesPerdidasDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idUsuario),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idEstatusOportunidad),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("spOportunidades_ObtenerOportunidadesPorEstatus", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new OportunidadesPerdidasDto
                    {
                        IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                        Prospecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                        Oportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                        Tipo = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                        Ejecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                        Monto = ComprobarNulos.CheckDecimalNull(reader["monto"]),
                        FechaInicio = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistroDate"]),
                        FechaEstimadaCierre = ComprobarNulos.CheckDateTimeNull(reader["FechaEstimadaCierre"]),
                        FechaCierre = ComprobarNulos.CheckDateTimeNull(reader["FechaEstimadaCierreUpd"]),
                        DiasFunnel = ComprobarNulos.CheckIntNull(reader["DiasFunnel"]),
                        UltimoComentario = ComprobarNulos.CheckStringNull(reader["Comentario"])
                    };

                    result.Add(dto);
                }
            }

            return result;
        }
    }
}