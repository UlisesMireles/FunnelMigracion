using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Funnel.Models.Dto
{
    public class ConsultaGeneralOportunidadesSchema
    {
        [JsonProperty("TABLE_NAME")]
        public string TableName { get; set; } = string.Empty;

        [JsonProperty("COLUMN_NAME")]
        public string ColumnName { get; set; } = string.Empty;

        [JsonProperty("DATA_TYPE")]
        public string DataType { get; set; } = string.Empty;

        [JsonProperty("NUMERIC_PRECISION")]
        public int Presicion { get; set; }

        [JsonProperty("CHARACTER_MAXIMUM_LENGTH")]
        public int Length { get; set; }
    }
}
