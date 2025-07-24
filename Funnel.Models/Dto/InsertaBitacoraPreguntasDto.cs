using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class InsertaBitacoraPreguntasDto : BaseOut
    {
        public int? IdBot { get; set; }
        public string? Pregunta { get; set; } = string.Empty;
        public DateTime? FechaPregunta { get; set; }
        public string? Respuesta { get; set; } = string.Empty;
        public DateTime? FechaRespuesta { get; set; }
        public bool? Respondio { get; set; }
        public int? TokensEntrada { get; set; }
        public int? TokensSalida { get; set; }
        public int? IdUsuario { get; set; }
        public double? CostoPregunta { get; set; }
        public double? CostoRespuesta { get; set; }
        public double? CostoTotal { get; set; }
        public string? Modelo { get; set; } = string.Empty;
    }
}
