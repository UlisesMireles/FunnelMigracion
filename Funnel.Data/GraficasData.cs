using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Funnel.Data
{
    public class GraficasData : IGraficasData
    {
        private readonly string _connectionString;
        public GraficasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data)
        {
            List<GraficaDto> result = new List<GraficaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera),
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new GraficaDto();
                        dto.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                        dto.Label = ComprobarNulos.CheckStringNull(reader["Concepto"]);
                        dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Monto"]);
                        dto.Area = ComprobarNulos.CheckIntNull(reader["Area"]);
                        dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorSerie"]);

                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la gráfica de oportunidades", ex);
                
            }

            return result;
        }
    }
}
