using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class ProcesosData : IProcesosData
    {
        private readonly string _connectionString;
        public ProcesosData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<ProcesosDTO> ConsultarEtapasPorProceso(int IdProceso)
        {
            ProcesosDTO result = new ProcesosDTO();
            List<OportunidadesTarjetasDto> etapas = new List<OportunidadesTarjetasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "PROCESOS-ETAPAS" ),
                    DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdProceso )
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProcesos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new OportunidadesTarjetasDto();

                    result.IdProceso = ComprobarNulos.CheckIntNull(reader["IdProceso"]);
                    result.Nombre = ComprobarNulos.CheckStringNull(reader["NombreProceso"]);
                    result.Estatus = ComprobarNulos.CheckBooleanNull(reader["Estatus"]);

                    dto.IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["NombreEtapa"]);
                    dto.Orden = ComprobarNulos.CheckStringNull(reader["Orden"]);
                    dto.Probabilidad = ComprobarNulos.CheckStringNull(reader["Probabilidad"]);
                    dto.RIdProcesoEtapa = ComprobarNulos.CheckIntNull(reader["RIdProcesoEtapa"]);

                    etapas.Add(dto);
                }
            }
            result.Etapas = etapas;
            return result;
        }

        public async Task<List<ProcesosDTO>> ConsultarProcesos(int IdEmpresa)
        {
            List<ProcesosDTO> result = new List<ProcesosDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "PROCESOS-POR-EMPRESA" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa )
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProcesos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ProcesosDTO();

                    dto.IdProceso = ComprobarNulos.CheckIntNull(reader["Id"]);
                    dto.IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.Estatus = ComprobarNulos.CheckBooleanNull(reader["Estatus"]);
                    dto.Oportunidades = ComprobarNulos.CheckIntNull(reader["Oportunidades"]);
                    dto.OportunidadesGanadas = ComprobarNulos.CheckIntNull(reader["OportunidadesGanadas"]);
                    dto.OportunidadesPerdidas = ComprobarNulos.CheckIntNull(reader["OportunidadesPerdidas"]);
                    dto.OportunidadesCanceladas = ComprobarNulos.CheckIntNull(reader["OportunidadesCanceladas"]);
                    dto.OportunidadesEliminadas = ComprobarNulos.CheckIntNull(reader["OportunidadesEliminadas"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> InsertarModificarEtapa(OportunidadesTarjetasDto request, string bandera)
        {
            BaseOut result = new BaseOut();
            try
            {
                int IdStage = 0;
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, bandera ),
                    DataBase.CreateParameterSql("@pIdStage", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdStage ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pNombreEtapa", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pOrdenEtapa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.Orden ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@pProbabilidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Probabilidad ?? (object)DBNull.Value )
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProcesos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        IdStage = ComprobarNulos.CheckIntNull(reader["IdStage"]);
                    }
                }
                switch (bandera)
                {
                    case "INSERTAR-ETAPA":
                        result.ErrorMessage = "Etapa insertada correctamente.";
                        result.Id = IdStage;
                        result.Result = true;
                        break;
                    case "UPDATE-ETAPA":
                        result.ErrorMessage = "Etapa actualizada correctamente.";
                        result.Id = IdStage;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (bandera)
                {
                    case "INSERTAR-ETAPA":
                        result.ErrorMessage = "Error al insertar etapa: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "UPDATE-ETAPA":
                        result.ErrorMessage = "Error al actualizar etapa: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }
            }
            return result;
        }

        public async Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request)
        {
            BaseOut result = new BaseOut();
            DataTable dtProcesosEtapas = new DataTable("ProcesosEtapas");

            dtProcesosEtapas.Columns.Add(new DataColumn("RIdProcesoEtapa", typeof(int)));
            dtProcesosEtapas.Columns.Add(new DataColumn("IdProceso", typeof(int)));
            dtProcesosEtapas.Columns.Add(new DataColumn("IdStage", typeof(int)));
            dtProcesosEtapas.Columns.Add(new DataColumn("Estatus", typeof(bool)));

            foreach (var item in request.Etapas)
            {
                DataRow row = dtProcesosEtapas.NewRow();
                row["RIdProcesoEtapa"] = item.RIdProcesoEtapa;
                row["IdProceso"] = request.IdProceso;
                row["IdStage"] = item.IdStage;
                row["Estatus"] = item.Eliminado is not null && item.Eliminado == true && item.IdStage > 0 ? false : true;
                dtProcesosEtapas.Rows.Add(row);
            }

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "INS-PROCESO-ETAPA" ),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdEmpresa ),
                DataBase.CreateParameterSql("@pIdProceso", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdProceso ),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdUsuario ),
                DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ),
                DataBase.CreateParameterSql("@pEstatus", SqlDbType.Bit, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.Estatus),
                DataBase.CreateParameterSql("@pRProsceosEtapas", SqlDbType.Structured, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, dtProcesosEtapas)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProcesos", CommandType.StoredProcedure, list, _connectionString))

                result.ErrorMessage = "Proceso guardado correctamente.";
                result.Id = 1;
                result.Result = true;
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                result.ErrorMessage = $"Error al guardar proceso: Ya existe un proceso con ese Nombre";
                result.Id = 0;
                result.Result = false;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = $"Error al guardar proceso: {ex.Message}";
                result.Id = 0;
                result.Result = false;
            }

            return result;
        }
    }
}
