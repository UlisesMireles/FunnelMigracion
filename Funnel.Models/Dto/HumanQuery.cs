using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class HumanQuery
    {
        public string sql_query { get; set; } = string.Empty;
        public string original_query { get; set; } = string.Empty;
        public int error_question { get; set; }
        public string error_message { get; set; } = string.Empty;
    }
}
