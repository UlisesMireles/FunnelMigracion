using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Funnel.Data
{
    public class AsistentesData : IAsistentesData
    {
        private readonly string _connectionString;

        public AsistentesData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<ConfiguracionDto?> ObtenerConfiguracionPorIdBotAsync(int idBot)
        {
            List<ConfiguracionDto> result = new List<ConfiguracionDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_ConfiguracionAsistentesPorIdBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ConfiguracionDto();
                    dto.Modelo = ComprobarNulos.CheckStringNull(reader["Modelo"]);
                    dto.Llave = ComprobarNulos.CheckStringNull(reader["Llave"]);
                    dto.Prompt = ComprobarNulos.CheckStringNull(reader["Prompt"]);
                    dto.RutaDocumento = ComprobarNulos.CheckStringNull(reader["RutaDocumento"]);
                    dto.FileId = ComprobarNulos.CheckStringNull(reader["FileId"]);
                    dto.CostoTokensEntrada = (double)ComprobarNulos.CheckDecimalNull(reader["CostoTokensEntrada"]);
                    dto.CostoTokensSalida = (double)ComprobarNulos.CheckDecimalNull(reader["CostoTokensSalida"]);
                    result.Add(dto);
                }
            }
            return result.FirstOrDefault();
        }
        public async Task<BaseOut> GuardarFileIdLeadEisei(int idBot, string fileId)
        {
            BaseOut result = new BaseOut();
            IList<Parameter> list = new List<Parameter>
           {
               DataBase.CreateParameter("@IdBot", DbType.Int32, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot),
               DataBase.CreateParameter("@FileId", DbType.String, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, fileId),
               DataBase.CreateParameter("@Result", DbType.Boolean, 0, ParameterDirection.Output, false, null, DataRowVersion.Default, result.Result ?? false),
               DataBase.CreateParameter("@Error", DbType.String, 0, ParameterDirection.Output, false, null, DataRowVersion.Default, result.ErrorMessage ?? string.Empty)
           };

            SqlCommand paramsOut = await DataBase.ExecuteOut("F_ConfiguracionAsistentes_GuardarFileId", CommandType.StoredProcedure, list, _connectionString);
            result.Result = Convert.ToBoolean(paramsOut.Parameters["@Result"].Value.ToString());
            result.ErrorMessage = paramsOut.Parameters["@Error"].Value.ToString() ?? string.Empty;

            return result;
        }
        public async Task<InsertaBitacoraPreguntasDto> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert)
        {
            try
            {
                if (insert != null)
                {
                    IList<ParameterSQl> listaParametros = new List<ParameterSQl>
                    {
                        DataBase.CreateParameterSql("@pResult", SqlDbType.Binary, 1, ParameterDirection.Output, false, "Result", DataRowVersion.Default, insert.Result),
                        DataBase.CreateParameterSql("@pErrorMessage", SqlDbType.VarChar, -1, ParameterDirection.Output, false, "ErrorMessage", DataRowVersion.Default, insert.ErrorMessage),
                        DataBase.CreateParameterSql("@pIdBot", SqlDbType.Int, 10, ParameterDirection.Input, false, "IdBot", DataRowVersion.Default, insert.IdBot),
                        DataBase.CreateParameterSql("@pPregunta", SqlDbType.VarChar, 1000, ParameterDirection.Input, false, "Pregunta", DataRowVersion.Default, insert.Pregunta),
                        DataBase.CreateParameterSql("@pFechaPregunta", SqlDbType.DateTime, 8, ParameterDirection.Input, false, "FechaPregunta", DataRowVersion.Default, insert.FechaPregunta),
                        DataBase.CreateParameterSql("@pRespuesta", SqlDbType.VarChar, -1, ParameterDirection.Input, false, "Respuesta", DataRowVersion.Default, insert.Respuesta),
                        DataBase.CreateParameterSql("@pFechaRespuesta", SqlDbType.DateTime, 8, ParameterDirection.Input, false, "FechaRespuesta", DataRowVersion.Default, insert.FechaRespuesta),
                        DataBase.CreateParameterSql("@pRespondio", SqlDbType.Bit, 1, ParameterDirection.Input, false, "Respondio", DataRowVersion.Default, insert.Respondio),
                        DataBase.CreateParameterSql("@pTokensEntrada", SqlDbType.Int, 10, ParameterDirection.Input, false, "TokensEntrada", DataRowVersion.Default, insert.TokensEntrada),
                        DataBase.CreateParameterSql("@pTokensSalida", SqlDbType.Int, 10, ParameterDirection.Input, false, "TokensSalida", DataRowVersion.Default, insert.TokensSalida),
                        DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, "IdUsuario", DataRowVersion.Default, insert.IdUsuario),
                        DataBase.CreateParameterSql("@pCostoPregunta", SqlDbType.Decimal, 18, ParameterDirection.Input, false, "CostoPregunta", DataRowVersion.Default, insert.CostoPregunta),
                        DataBase.CreateParameterSql("@pCostoRespuesta", SqlDbType.Decimal, 18, ParameterDirection.Input, false, "CostoRespuesta", DataRowVersion.Default, insert.CostoRespuesta),
                        DataBase.CreateParameterSql("@pCostoTotal", SqlDbType.Decimal, 18, ParameterDirection.Input, false, "CostoTotal", DataRowVersion.Default, insert.CostoTotal),
                        DataBase.CreateParameterSql("@pModelo", SqlDbType.VarChar, 50, ParameterDirection.Input, false, "Modelo", DataRowVersion.Default, insert.Modelo)
                    };

                    using (IDataReader reader = await DataBase.GetReaderSql("F_InsertaPreguntaBitacoraPreguntas", CommandType.StoredProcedure, listaParametros, _connectionString))
                    {
                        while (reader.Read())
                        {
                            insert.ErrorMessage = ComprobarNulos.CheckStringNull(reader["@pErrorMessage"]);
                            insert.Result = ComprobarNulos.CheckBooleanNull(reader["@pResult"]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                insert.Result = false;
                insert.ErrorMessage = ex.Message;
            }

            return insert;
        }
        public async Task<List<PreguntasFrecuentesDto>> ObtenerPreguntasFrecuentesAsync(int idBot)
        {
            List<PreguntasFrecuentesDto> result = new List<PreguntasFrecuentesDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
            DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_PreguntasFrecuentesActivasPorBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new PreguntasFrecuentesDto
                    {
                        Id = ComprobarNulos.CheckIntNull(reader["Id"]),
                        IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]),
                        Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]),
                        Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]),
                        Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]),
                        Categoria = ComprobarNulos.CheckStringNull(reader["Categoria"]),
                        IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"])
                    };
                    result.Add(dto);
                }
            }

            return result;
        }
        public async Task<List<InstruccionesAdicionalesDto>> ObtenerInstruccionesAdicionalesPorIdBot(int idBot)
        {
            List<InstruccionesAdicionalesDto> result = new List<InstruccionesAdicionalesDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
             {
                 DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot)
             };
            using (IDataReader reader = await DataBase.GetReaderSql("InstruccionesAdicionalesAsistentes_ConsultarPorIdBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new InstruccionesAdicionalesDto();
                    dto.Instrucciones = ComprobarNulos.CheckStringNull(reader["Instruccion"]);
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
