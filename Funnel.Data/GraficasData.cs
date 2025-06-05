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
                        if (data.Bandera == "SEL-OPORTUNIDAD-STAGE")
                        {
                            dto.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Concepto"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Monto"]);
                            dto.Area = ComprobarNulos.CheckIntNull(reader["Area"]);
                            dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorSerie"]);

                            result.Add(dto);
                        }
                        else if (data.Bandera == "SEL-TIPO-SIN-MONTOS-CEROS")
                        {
                            dto.Id = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]);
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Monto"]);
                            dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);
                            dto.Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"]);

                            result.Add(dto);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la gráfica de oportunidades", ex);
                
            }

            return result;
        }
        public async Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data)
        {
            List<GraficaDto> result = new List<GraficaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera ?? "")
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new GraficaDto();
                       
                        if (data.Bandera == "SEL-AGENTE-CLIENTES")
                        {
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["TotalAgente"]);
                            dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorNormalizado"]);
                            dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);

                            result.Add(dto);
                        }
                        else
                        {
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Monto"]);
                            dto.Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"]);
                            dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);

                            result.Add(dto);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la gráfica de oportunidades", ex);

            }

            return result;
        }
        public async Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data)
        {
            List<AgenteDto> result = new List<AgenteDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera),
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new AgenteDto();
                        
                        dto.IdAgente = ComprobarNulos.CheckIntNull(reader["IdUsuario"]);
                        dto.Nombre = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]);
                        dto.TotalAgente = ComprobarNulos.CheckDecimalNull(reader["TotalAgente"]);
                        dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);
                        dto.ArchivoImagen = ComprobarNulos.CheckStringNull(reader["ArchivoImagen"]);

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
        public async Task<List<GraficaDto>> ObtenerGraficaGanadasAnio(RequestGrafica data)
        {
            List<GraficaDto> result = new List<GraficaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEstatusOportunidad),
                DataBase.CreateParameterSql("@pAnio", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Anio),
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_OportunidadesGraficasPorEstatus", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new GraficaDto();
                        if (data.Bandera == "SEL-CLIENTES-ANIO")
                        {
                            //dto.Id = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]);
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["TotalAnio"]);
                            dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);
                            dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorNormalizado"]);

                            result.Add(dto);
                        }
                        else if (data.Bandera == "SEL-TIPO-ANIO")
                        {
                            //dto.Id = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]);
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["TotalAnio"]);
                            dto.MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]);
                            dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorNormalizado"]);

                            result.Add(dto);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la gráfica de oportunidades ganadas por anio", ex);

            }

            return result;
        }
    }
}
