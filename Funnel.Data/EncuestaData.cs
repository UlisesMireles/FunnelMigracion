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
                DataBase.CreateParameterSql("@IdCategoria", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 15),
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
    }
}
