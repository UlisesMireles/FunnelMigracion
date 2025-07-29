using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
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
                            dto.Contador = ComprobarNulos.CheckIntNull(reader["Contador"]);
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
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera ?? ""),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
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
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
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
        public async Task<List<AniosDto>> Anios(int IdEmpresa, int IdEstatusOportunidad, int IdProceso)
        {
            List<AniosDto> result = new List<AniosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ANIOS-POR_ESTATUS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEstatusOportunidad),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, IdProceso)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_OportunidadesGraficasPorEstatus", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new AniosDto();
                    dto.Anio = ComprobarNulos.CheckIntNull(reader["Anio"]);
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<List<SectorDto>> ObtenerOportunidadesPorSector(RequestGrafica data)
        {
            List<SectorDto> result = new List<SectorDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-AGENTE-SECTOR"),
                DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new SectorDto
                        {
                            IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]),
                            NombreSector = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener oportunidades por sector. Detalle: {ex.Message}", ex);
            }

            return result;
        }

        public async Task<List<OportunidadSectorDto>> ObtenerDetalleOportunidadesSector(int idSector, RequestGrafica data)
        {
            List<OportunidadSectorDto> result = new List<OportunidadSectorDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, 1),
                DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, -1),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idSector),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidadesPorSector", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new OportunidadSectorDto
                        {
                            IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                            NombreProspecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                            NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                            TipoProyecto = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Ejecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            FechaEstimadaCierre = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierre"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                            Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                            TipoProyectoAbreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                            Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener detalle de oportunidades por sector", ex);
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
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
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
                            dto.Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"]);
                            //dto.ColoreSerie = ComprobarNulos.CheckStringNull(reader["ColorNormalizado"]);

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
                        else if (data.Bandera == "SEL-TOTALES-ANUALES")
                        {
                            //dto.Id = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]);
                            dto.Label = reader["Anio"].ToString();
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Monto"]);
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
        public async Task<List<AgenteDto>> ObtenerAgentesPorAnio(RequestGrafica data)
        {
            List<AgenteDto> result = new List<AgenteDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEstatusOportunidad),
                DataBase.CreateParameterSql("@pAnio", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Anio),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_OportunidadesGraficasPorEstatus", CommandType.StoredProcedure, list, _connectionString))
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
                throw new Exception("Error al obtener agentes por anio", ex);

            }

            return result;
        }
        public async Task<List<GraficaDto>> ObtenerGraficaAgentesPorAnio(RequestGrafica data)
        {
            List<GraficaDto> result = new List<GraficaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera ?? ""),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEstatusOportunidad),
                DataBase.CreateParameterSql("@pAnio", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Anio ?? 0),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_OportunidadesGraficasPorEstatus", CommandType.StoredProcedure, list, _connectionString))
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
                throw new Exception("Error al obtener la gráfica de agentes por anio", ex);

            }

            return result;
        }
        public async Task<List<TipoProyectoDto>> ObtenerOportunidadesPorTipo(RequestGrafica data)
        {
            List<TipoProyectoDto> result = new List<TipoProyectoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-TIPO-SIN-MONTOS-CEROS"),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
             };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new TipoProyectoDto
                        {
                            IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]),
                            Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener oportunidades por tipo de proyecto. Detalle: {ex.Message}", ex);
            }

            return result;
        }

        public async Task<List<OportunidadTipoDto>> ObtenerDetalleOportunidadesTipo(int idTipoProyecto, RequestGrafica data)
        {
            List<OportunidadTipoDto> result = new List<OportunidadTipoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, 1),
                DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, -1),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdTipoProyecto", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idTipoProyecto),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidadesPorTipo", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new OportunidadTipoDto
                        {
                            IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                            NombreProspecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                            NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                            TipoProyecto = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Ejecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            FechaEstimadaCierre = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierre"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                            Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                            TipoProyectoAbreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                            Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener detalle de oportunidades por tipo de proyecto", ex);
            }

            return result;
        }

        public async Task<List<GraficaDto>> ObtenerGraficaClientesTopVeinte(RequestGrafica data)
        {
            List<GraficaDto> result = new List<GraficaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Bandera ?? ""),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pAnio", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.Anio != null ? data.Anio : DBNull.Value),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new GraficaDto();

                        if (data.Bandera == "SELECT-TOPDIEZ-CLIENTES-ORDER")
                        {
                            dto.Label = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["OportunidadesSolicitadas"]);
                            dto.Valor2 = ComprobarNulos.CheckDecimalNull(reader["Ganadas"]);
                            dto.ColoreSerie = "#b94d0a";
                            dto.Porcentaje = ComprobarNulos.CheckDecimalNull(reader["PorcGanadas"]);

                            result.Add(dto);
                        }
                        else
                        {
                            dto.Label = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                            dto.Valor = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"]);
                            dto.Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"]);

                            result.Add(dto);
                        }

                            
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la gráfica de clientes top mejor porcentaje ganadas", ex);

            }

            return result;
        }
        public async Task<List<OportunidadAgenteClienteDto>> ObtenerOportunidadesPorAgenteClientes(RequestGrafica data)
        {
            List<OportunidadAgenteClienteDto> result = new List<OportunidadAgenteClienteDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-OPORTUNIDADES-AGENTE"),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEstatusOportunidad),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new OportunidadAgenteClienteDto
                        {
                            IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                            NombreProspecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                            NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                            NombreAbreviado = ComprobarNulos.CheckStringNull(reader["NombreAbreviado"]),
                            TipoProyecto = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            TipoProyectoAbreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                            Entrega = ComprobarNulos.CheckStringNull(reader["Entrega"]),
                            EntregaDescripcion = ComprobarNulos.CheckStringNull(reader["EntregaDescripcion"]),
                            Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                            NombreEjecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["monto"]),
                            Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                            FechaModificacion = ComprobarNulos.CheckIntNull(reader["FechaModificacion"]),
                            Comentario = ComprobarNulos.CheckStringNull(reader["Comentario"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            FechaRegistro = ComprobarNulos.CheckStringNull(reader["FechaRegistro"]),
                            AbreviaturaEstatus = ComprobarNulos.CheckStringNull(reader["AbreviaturaEstatus"]),
                            DescripcionEstatus = ComprobarNulos.CheckStringNull(reader["DescripcionEstatus"]),
                            decProbabilidad = ComprobarNulos.CheckDecimalNull(reader["decProbabilidad"]),
                            IdEjecutivo = ComprobarNulos.CheckIntNull(reader["IdEjecutivo"]),
                            FechaEstimadaCierreUpd = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierreUpd"]),
                            FechaEstimadaCierre = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierre"]),
                            ProbabilidadOriginal = ComprobarNulos.CheckStringNull(reader["ProbabilidadOriginal"]),
                            IdEstatusOportunidad = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]),
                            IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]),
                            Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener oportunidades por agente-clientes. Detalle: {ex.Message}", ex);
            }

            return result;
        }

        public async Task<List<TipoOportunidadAgenteDto>> ObtenerOportunidadesPorAgenteTipo(RequestGrafica data)
        {
            List<TipoOportunidadAgenteDto> result = new List<TipoOportunidadAgenteDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-TIPO-OPOR-AGENTE"),
                DataBase.CreateParameterSql("@pIdAgente", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new TipoOportunidadAgenteDto
                        {
                            IdTipoOporAgente = ComprobarNulos.CheckIntNull(reader["IdTipoOporAgente"]),
                            Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener oportunidades por agente-tipo. Detalle: {ex.Message}", ex);
            }

            return result;
        }

        public async Task<List<DetalleOportunidadTipoAgenteDto>> ObtenerDetalleOportunidadesTipoAgente(int idAgente, int idTipoOporAgente, RequestGrafica data)
        {
            List<DetalleOportunidadTipoAgenteDto> result = new List<DetalleOportunidadTipoAgenteDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, 1),
                DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, -1),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pIdAgente", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idAgente),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdTipoOporAgente", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idTipoOporAgente),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidadesPorTipoOporAgente", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new DetalleOportunidadTipoAgenteDto
                        {
                            IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                            NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]),
                            NombreProspecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                            NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                            NombreAbreviado = ComprobarNulos.CheckStringNull(reader["NombreAbreviado"]),
                            TipoProyectoAbreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                            TipoProyecto = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                            NombreEjecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                            FechaModificacion = ComprobarNulos.CheckIntNull(reader["FechaModificacion"]),
                            Comentario = ComprobarNulos.CheckStringNull(reader["Comentario"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            FechaRegistro = ComprobarNulos.CheckStringNull(reader["FechaRegistro"]),
                            AbreviaturaEstatus = ComprobarNulos.CheckStringNull(reader["AbreviaturaEstatus"]),
                            DescripcionEstatus = ComprobarNulos.CheckStringNull(reader["DescripcionEstatus"]),
                            ProbabilidadDecimal = ComprobarNulos.CheckDecimalNull(reader["decProbabilidad"]),
                            IdEjecutivo = ComprobarNulos.CheckIntNull(reader["IdEjecutivo"]),
                            FechaEstimadaCierre = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierre"]),
                            ProbabilidadOriginal = ComprobarNulos.CheckStringNull(reader["ProbabilidadOriginal"]),
                            DiasFunnel = ComprobarNulos.CheckIntNull(reader["DiasFunnel"]),
                            IdEstatusOportunidad = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]),
                            IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]),
                            Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                            TooltipStage = ComprobarNulos.CheckStringNull(reader["TooltipStage"]),
                            TotalComentarios = ComprobarNulos.CheckIntNull(reader["TotalComentarios"]),
                            IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener detalle de oportunidades por tipo-agente", ex);
            }

            return result;
        }
        public async Task<List<TipoSectorAgenteDto>> ObtenerOportunidadesPorSectorPorAgente(RequestGrafica data)
        {
            List<TipoSectorAgenteDto> result = new List<TipoSectorAgenteDto>();
            IList<ParameterSQl> parameters = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-AGENTE-SECTOR-PERSONAL"),
                DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, parameters, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new TipoSectorAgenteDto
                        {
                            IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]),
                            Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),  
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            Porcentaje = ComprobarNulos.CheckDecimalNull(reader["Porcentaje"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener oportunidades por sector por agente. Detalle: {ex.Message}", ex);
            }

            return result;
        }

        public async Task<List<DetalleSectorAgenteDto>> ObtenerDetallesPorSectorPorAgente(int idAgente, int idSector, RequestGrafica data)
        {
            List<DetalleSectorAgenteDto> result = new List<DetalleSectorAgenteDto>();
            IList<ParameterSQl> parameters = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, 1),
                DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, -1),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdEmpresa),
                DataBase.CreateParameterSql("@pIdAgente", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idAgente),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0),
                DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idSector),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdProceso)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidadesPorSectorAgente", CommandType.StoredProcedure, parameters, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new DetalleSectorAgenteDto
                        {
                            NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]),
                            IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                            NombreProspecto = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                            NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                            NombreAbreviado = ComprobarNulos.CheckStringNull(reader["NombreAbreviado"]),
                            TipoProyectoAbreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                            TipoProyecto = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                            NombreEjecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                            Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                            Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                            FechaModificacion = ComprobarNulos.CheckIntNull(reader["FechaModificacion"]),
                            Comentario = ComprobarNulos.CheckStringNull(reader["Comentario"]),
                            MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),
                            FechaRegistro = ComprobarNulos.CheckStringNull(reader["FechaRegistro"]),
                            AbreviaturaEstatus = ComprobarNulos.CheckStringNull(reader["AbreviaturaEstatus"]),
                            DescripcionEstatus = ComprobarNulos.CheckStringNull(reader["DescripcionEstatus"]),
                            ProbabilidadDecimal = ComprobarNulos.CheckDecimalNull(reader["decProbabilidad"]),
                            IdEjecutivo = ComprobarNulos.CheckIntNull(reader["IdEjecutivo"]),
                            FechaEstimadaCierre = ComprobarNulos.CheckStringNull(reader["FechaEstimadaCierre"]),
                            ProbabilidadOriginal = ComprobarNulos.CheckStringNull(reader["ProbabilidadOriginal"]),
                            DiasFunnel = ComprobarNulos.CheckIntNull(reader["DiasFunnel"]),
                            IdEstatusOportunidad = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]),
                            IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]),
                            Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                            TooltipStage = ComprobarNulos.CheckStringNull(reader["TooltipStage"]),
                            TotalComentarios = ComprobarNulos.CheckIntNull(reader["TotalComentarios"]),
                            IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"])
                        };
                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener detalles por sector por agente", ex);
            }

            return result;
        }
    }
}