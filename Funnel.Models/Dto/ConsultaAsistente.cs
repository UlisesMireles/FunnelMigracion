using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ConsultaAsistente
    {

        public bool Exitoso { get; set; }
        public string ErrorMensaje { get; set; } = string.Empty;
        public int IdBot { get; set; }
        public string Pregunta { get; set; } = string.Empty;
        public DateTime FechaPregunta { get; set; }
        public string Respuesta { get; set; } = string.Empty;
        public DateTime FechaRespuesta { get; set; }
        public int TokensEntrada { get; set; }
        public int TokensSalida { get; set; }
        public int IdUsuario { get; set; }
        public int IdTipoUsuario { get; set; }
        public int IdEmpresa { get; set; }
        public Boolean EsPreguntaFrecuente { get; set; }
    }
}
