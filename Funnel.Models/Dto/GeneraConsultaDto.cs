using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class GeneraConsultaDto : BaseOut
    {
        public int IdBot { get; set; }
        public string Pregunta { get; set; } = string.Empty;
        public DateTime FechaPregunta { get; set; }
        public string Consulta { get; set; } = string.Empty;
        public DateTime FechaRespuesta { get; set; }
        public int TokensEntrada { get; set; }
        public int TokensSalida { get; set; }
    }
}
