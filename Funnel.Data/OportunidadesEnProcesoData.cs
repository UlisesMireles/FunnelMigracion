using Microsoft.Extensions.Configuration;
using Funnel.Models.Base;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using System.Data;
using Funnel.Models.Dto;

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
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "STAGE"),
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
                        Nombre = reader["Nombre"] != DBNull.Value ? reader["Nombre"].ToString() : string.Empty,
                        NombreSector = reader["NombreSector"] != DBNull.Value ? reader["NombreSector"].ToString() : string.Empty,
                        NombreOportunidad = reader["NombreOportunidad"] != DBNull.Value ? reader["NombreOportunidad"].ToString() : string.Empty,
                        Abreviatura =  reader["Abreviatura"] != DBNull.Value ? reader["Abreviatura"].ToString() : string.Empty,
                        Descripcion = reader["Descripcion"] != DBNull.Value ? reader["Descripcion"].ToString() : string.Empty,
                        Stage = reader["Stage"] != DBNull.Value ? reader["Stage"].ToString() : string.Empty,
                        TooltipStage = reader["TooltipStage"] != DBNull.Value ? reader["TooltipStage"].ToString() : "Sin Asignar",
                        Iniciales = reader["Iniciales"] != DBNull.Value ? reader["Iniciales"].ToString() : string.Empty,
                        NombreEjecutivo = reader["NombreEjecutivo"] != DBNull.Value ? reader["NombreEjecutivo"].ToString() : "Sin Asignar",
                        NombreContacto = reader["NombreContacto"] != DBNull.Value ? reader["NombreContacto"].ToString() : string.Empty,
                        Entrega = reader["Entrega"] != DBNull.Value ? reader["Entrega"].ToString() : string.Empty,
                        EntregaDescripcion = reader["EntregaDescripcion"] != DBNull.Value ? reader["EntregaDescripcion"].ToString() : string.Empty,
                        Monto = reader["Monto"] != DBNull.Value ? Convert.ToDecimal(reader["Monto"]) : 0,
                        ProbabilidadOriginal = reader["ProbabilidadOriginal"] != DBNull.Value ? reader["ProbabilidadOriginal"].ToString() : "0 %",
                        Probabilidad = reader["Probabilidad"] != DBNull.Value ? reader["Probabilidad"].ToString() : "0 %",
                        MontoNormalizado = reader["MontoNormalizado"] != DBNull.Value ? Convert.ToDecimal(reader["MontoNormalizado"]) : 0,
                        FechaRegistro = (DateTime)(reader["FechaRegistro"] != DBNull.Value ? Convert.ToDateTime(reader["FechaRegistro"]) : (DateTime?)null),
                        DiasFunnel = reader["DiasFunnel"] != DBNull.Value ? Convert.ToInt32(reader["DiasFunnel"]) : 0,
                        FechaEstimadaCierreOriginal = (DateTime)(reader["FechaEstimadaCierreOriginal"] != DBNull.Value ? Convert.ToDateTime(reader["FechaRegistro"]) : (DateTime?)null),
                        FechaModificacion = reader["FechaModificacion"] != DBNull.Value ? Convert.ToInt32(reader["FechaModificacion"]) : 0,
                    };

                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    
                };

                using (IDataReader reader = await DataBase.GetReaderSql("", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }

                }
                
            }
            catch (Exception ex)
            {

                
            }
            return result;
        }
    }
}
