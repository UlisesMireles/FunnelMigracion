using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class InstruccionesAdicionalesDto
    {
        public int IdBot { get; set; }
        public string Instrucciones { get; set; } = string.Empty;
    }
}
