using Microsoft.Extensions.Configuration;
using Funnel.Models.Base;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using System.Data;
using Funnel.Models.Dto;
using System.Net.NetworkInformation;

namespace Funnel.Data
{
    public class OportunidadesEnProcesoData : IOportunidadesEnProcesoData
    {
        private readonly string _connectionString;
        public OportunidadesEnProcesoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<ContactoDto>> ComboContactos(int IdEmpresa, int IdProspecto)
        {
            List<ContactoDto> result = new List<ContactoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa),
                DataBase.CreateParameterSql("@IdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdProspecto)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoContactosProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ContactoDto();
                    dto.IdContactoProspecto = ComprobarNulos.CheckIntNull(reader["IdContactoProspecto"]);
                    dto.NombreCompleto = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]);
                   
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboEjecutivosDto>> ComboEjecutivos(int IdEmpresa)
        {
            List<ComboEjecutivosDto> result = new List<ComboEjecutivosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "EJECUTIVOS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboEjecutivosDto();
                    dto.IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]);
                    dto.NombreCompleto = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboEntregasDto>> ComboEntregas(int IdEmpresa)
        {
            List<ComboEntregasDto> result = new List<ComboEntregasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "TIPOENTREGAS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboEntregasDto();
                    dto.IdTipoEntrega = ComprobarNulos.CheckIntNull(reader["IdTipoEntrega"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                   
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboEtapasDto>> ComboEtapas(int IdEmpresa)
        {
            List<ComboEtapasDto> result = new List<ComboEtapasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "INDICADORES-STAGE"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboEtapasDto();
                    dto.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                    dto.Stage = ComprobarNulos.CheckStringNull(reader["Stage"]);
                    dto.Concepto = ComprobarNulos.CheckStringNull(reader["Concepto"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                    dto.Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa)
        {
            List<ComboProspectosDto> result = new List<ComboProspectosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "PROSPECTOS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboProspectosDto();
                    dto.Id = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboServiciosDto>> ComboServicios(int IdEmpresa)
        {
            List<ComboServiciosDto> result = new List<ComboServiciosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "TIPOOPORTUNIDADES"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboServiciosDto();
                    dto.IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboEstatusOportunidad>> ComboTipoOportunidad(int IdEmpresa)
        {
            List<ComboEstatusOportunidad> result = new List<ComboEstatusOportunidad>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "ESTATUSOPORTUNIDAD"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboEstatusOportunidad();
                    dto.IdEstatus = ComprobarNulos.CheckIntNull(reader["IdEstatus"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<OportunidadesEnProcesoDto>> ConsultarHistoricoOportunidades(int IdEmpresa, int IdOportunidad)
        {
            List<OportunidadesEnProcesoDto> result = new List<OportunidadesEnProcesoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-HISTORICO"),
                DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdOportunidad),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new OportunidadesEnProcesoDto
                    {
                        NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        NombreEjecutivo = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]),
                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        Comentario = ComprobarNulos.CheckStringNull(reader["Comentario"]),
                    };

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus)
        {
            List<OportunidadesEnProcesoDto> result = new List<OportunidadesEnProcesoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdUsuario),
                DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEstatus),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("spOportunidades_ObtenerOportunidadesPorEstatus", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new OportunidadesEnProcesoDto
                    {
                        IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                        IdProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]),
                        IdContactoProspecto = ComprobarNulos.CheckIntNull(reader["IdContactoProspecto"]),
                        IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]),
                        IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]),
                        IdTipoEntrega = ComprobarNulos.CheckIntNull(reader["IdTipoEntrega"]),
                        IdEstatusOportunidad = ComprobarNulos.CheckIntNull(reader["IdEstatusOportunidad"]),
                        IdEjecutivo = ComprobarNulos.CheckIntNull(reader["IdEjecutivo"]),

                        Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                        NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]),
                        NombreOportunidad = ComprobarNulos.CheckStringNull(reader["NombreOportunidad"]),
                        Abreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                        Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                        Stage = ComprobarNulos.CheckStringNull(reader["Stage"]),
                        TooltipStage = ComprobarNulos.CheckStringNull(reader["TooltipStage"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        NombreEjecutivo = ComprobarNulos.CheckStringNull(reader["NombreEjecutivo"]),
                        NombreContacto = ComprobarNulos.CheckStringNull(reader["NombreContacto"]),
                        Entrega = ComprobarNulos.CheckStringNull(reader["Entrega"]),
                        EntregaDescripcion = ComprobarNulos.CheckStringNull(reader["EntregaDescripcion"]),

                        Monto = ComprobarNulos.CheckDecimalNull(reader["Monto"]),
                        ProbabilidadOriginal = ComprobarNulos.CheckStringNull(reader["ProbabilidadOriginal"]),
                        Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]),
                        MontoNormalizado = ComprobarNulos.CheckDecimalNull(reader["MontoNormalizado"]),

                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        DiasFunnel = ComprobarNulos.CheckIntNull(reader["DiasFunnel"]),
                        FechaEstimadaCierreOriginal = ComprobarNulos.CheckDateTimeNull(reader["FechaEstimadaCierreOriginal"]),

                        FechaModificacion = ComprobarNulos.CheckIntNull(reader["FechaModificacion"]),
                        Comentario = ComprobarNulos.CheckStringNull(reader["Comentario"]),
                        TotalComentarios = ComprobarNulos.CheckIntNull(reader["TotalComentarios"]),
                        DiasEtapa1 = ComprobarNulos.CheckIntNull(reader["DiasEtapa1"]),
                        DiasEtapa2 = ComprobarNulos.CheckIntNull(reader["DiasEtapa2"]),
                        DiasEtapa3 = ComprobarNulos.CheckIntNull(reader["DiasEtapa3"]),
                        DiasEtapa4 = ComprobarNulos.CheckIntNull(reader["DiasEtapa4"]),
                        DiasEtapa5 = ComprobarNulos.CheckIntNull(reader["DiasEtapa5"]),

                    };

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> GuardarHistorico(OportunidadesEnProcesoDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                decimal probabilidadDecimal = 0;

                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera),
                    DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdOportunidad),
                    DataBase.CreateParameterSql("@pComentario", SqlDbType.VarChar, -1, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Comentario),
                    DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
                    DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Stage),


                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }

                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar el historico.";
            }
            return result;
        }

        public async Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                decimal probabilidadDecimal = 0; 

                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera),
                    DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdOportunidad),
                    DataBase.CreateParameterSql("@pIdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdProspecto),
                    DataBase.CreateParameterSql("@pNombreOportunidad", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Descripcion),
                    DataBase.CreateParameterSql("@pMonto", SqlDbType.Decimal, 18, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Monto),
                    DataBase.CreateParameterSql("@pFechaEstimadaCierre", SqlDbType.Date, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.FechaEstimadaCierreOriginal),
                    DataBase.CreateParameterSql("@pIdEjecutivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEjecutivo),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa),
                    DataBase.CreateParameterSql("@pIdTipoEntrega", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdTipoEntrega),
                    DataBase.CreateParameterSql("@pStage", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdStage),
                    DataBase.CreateParameterSql("@pIdContacto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdContactoProspecto),
                    DataBase.CreateParameterSql("@pComentario", SqlDbType.VarChar, -1, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Comentario),
                    DataBase.CreateParameterSql("@pIdTipoOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdTipoProyecto),
                    DataBase.CreateParameterSql("@pIdEstatusOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEstatusOportunidad),
                    DataBase.CreateParameterSql("@pProbabilidad", SqlDbType.Decimal, 18, ParameterDirection.Input, false, null, DataRowVersion.Default, decimal.Parse(request.Probabilidad)),
                    DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 1),

                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoOportunidades", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }

                }
                switch (request.Bandera)
                {
                    case "INS-OPORTUNIDAD":
                        result.ErrorMessage = "Oportunidad insertada correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "UPD-OPORTUNIDAD":
                        result.ErrorMessage = "Oportunidad actualizada correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {
                switch (request.Bandera)
                {
                    case "INS-OPORTUNIDAD":
                        result.ErrorMessage = "Oportunidad insertada correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "UPD-OPORTUNIDAD":
                        result.ErrorMessage = "Oportunidad actualizada correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }
            }
            return result;
        }
    }
}
