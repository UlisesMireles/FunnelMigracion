using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
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
    public class EncuestaData : IEncuestaData
    {
        private readonly string _connectionString;
        public EncuestaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<EncuestaDto>> ConsultarPreguntasEncuesta()
        {
            List<EncuestaDto> result = new List<EncuestaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT-PREGUNTAS"),
                DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 7)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_EncuestaBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new EncuestaDto();
                    dto.IdPregunta = ComprobarNulos.CheckIntNull(reader["IdPregunta"]);
                    dto.Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]);
                    dto.TipoRespuesta = ComprobarNulos.CheckStringNull(reader["TipoRespuesta"]);
                    dto.Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]);
                 
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<InsertaBitacoraPreguntasDto> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert)
        {
            try
            {
                if (insert != null)
                {
                    insert.FechaPregunta = DateTime.Now;
                    insert.FechaRespuesta = DateTime.Now;

                    IList<ParameterSQl> listaParametros = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, "Bandera", DataRowVersion.Default, "INSERT-RESPUESTAS"),
                    DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 10, ParameterDirection.Input, false, "IdBot", DataRowVersion.Default, insert.IdBot),
                    DataBase.CreateParameterSql("@Pregunta", SqlDbType.VarChar, 255, ParameterDirection.Input, false, "Pregunta", DataRowVersion.Default, insert.Pregunta),
                    DataBase.CreateParameterSql("@FechaPregunta", SqlDbType.DateTime, 8, ParameterDirection.Input, false, "FechaPregunta", DataRowVersion.Default, insert.FechaPregunta),
                    DataBase.CreateParameterSql("@Respuesta", SqlDbType.VarChar, -1, ParameterDirection.Input, false, "Respuesta", DataRowVersion.Default, insert.Respuesta),
                    DataBase.CreateParameterSql("@FechaRespuesta", SqlDbType.DateTime, 8, ParameterDirection.Input, false, "FechaRespuesta", DataRowVersion.Default, insert.FechaRespuesta),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 10, ParameterDirection.Input, false, "IdUsuario", DataRowVersion.Default, insert.IdUsuario),
                };

                    using (IDataReader reader = await DataBase.GetReaderSql("F_EncuestaBot", CommandType.StoredProcedure, listaParametros, _connectionString))
                    {
                        while (reader.Read())
                        {
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
    }
}

