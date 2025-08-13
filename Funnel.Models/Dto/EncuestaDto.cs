using Funnel.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class EncuestaDto : BaseOut
    {
        public int? IdPregunta { get; set; }
        public string? Pregunta { get; set; }
        public string? TipoRespuesta { get; set; }
        public int? IdRespuesta { get; set; }
        public string? Respuesta { get; set; }
        public int? IdCategoria { get; set; }
        public int? IdBot { get; set; }
    }
}
