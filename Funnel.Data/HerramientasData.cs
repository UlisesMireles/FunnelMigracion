using Azure.Core;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
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

        public async Task<List<EjecucionProcesosReportesDTO>> ConsultarEjecucionProcesosPorEmpresa(int IdEmpresa)
        {
            List<EjecucionProcesosReportesDTO> result = new List<EjecucionProcesosReportesDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-POREMPRESA" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_EjecucionReportes", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new EjecucionProcesosReportesDTO();
                    dto.IdReporte = ComprobarNulos.CheckIntNull(reader["IdReporte"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.HoraEjecucion = ComprobarNulos.CheckTimeNull(reader["HoraEjecucion"]);
                    dto.Frecuencia = ComprobarNulos.CheckIntNull(reader["Frecuencia"]);
                    dto.DiasInactividad = ComprobarNulos.CheckIntNull(reader["DiasInactividad"]);
                    dto.DiasFechaVencida = ComprobarNulos.CheckIntNull(reader["DiasFechaVencida"]);
                    dto.EjecucionJob = ComprobarNulos.CheckBooleanNull(reader["EjecucionJob"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ComboCorreosUsuariosDTO>> ComboCorreosUsuariosActivos(int IdEmpresa)
        {
            List<ComboCorreosUsuariosDTO> result = new List<ComboCorreosUsuariosDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-USUARIOSACTIVOS" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_EjecucionReportes", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboCorreosUsuariosDTO();
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> GuardarDiasReportesEstatus(EjecucionProcesosReportesDTO request, bool estatus)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdEmpresa ),
                    DataBase.CreateParameterSql("@pIdReporte", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdReporte ),
                    DataBase.CreateParameterSql("@pEstatus", SqlDbType.Bit, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.EjecucionJob ),
                    DataBase.CreateParameterSql("@pDiasInactividad", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.DiasInactividad ),
                    DataBase.CreateParameterSql("@pDiasFechaVencida", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.DiasFechaVencida ),
                    DataBase.CreateParameterSql("@pUsuarioRegistro", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdUsuario )
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_EjecucionReportes", CommandType.StoredProcedure, list, _connectionString))
                result.ErrorMessage = estatus ? "Se ha cambiado el estatus éxitosamente" : "Datos Guardados correctamente.";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar datos: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }

        public async Task<BaseOut> EnvioCorreosReporteSeguimiento(int IdEmpresa, int IdReporte, string Correos)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                    DataBase.CreateParameterSql("@pIdReporte", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdReporte ),
                    DataBase.CreateParameterSql("@pCorreos", SqlDbType.VarChar, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, Correos )
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_Oportunidades_EnvioCorreoSemanal", CommandType.StoredProcedure, list, _connectionString))
                result.ErrorMessage = "Correo Enviado Exitosamente.";
                result.Id = 1;
                result.Result = true;

            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar datos: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }        
    }
}
