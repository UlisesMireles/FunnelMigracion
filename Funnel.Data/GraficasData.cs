﻿using Funnel.Data.Interfaces;
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
        public async Task<List<AniosDto>> Anios(int idEmpresa, int idEstatusOportunidad)
        {
            List<AniosDto> result = new List<AniosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-ANIOS-POR_ESTATUS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idEstatusOportunidad),
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
    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario ?? 0)
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
    DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idSector)
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
        DataBase.CreateParameterSql("@pIdTipoProyecto", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idTipoProyecto)
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
    }
}