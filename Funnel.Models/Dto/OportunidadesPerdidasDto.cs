using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class OportunidadesPerdidasDto
    {
        public int IdOportunidad { get; set; }
        public string Prospecto { get; set; } 
        public string Oportunidad { get; set; }
        public string Tipo { get; set; }
        public string Ejecutivo { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaEstimadaCierre { get; set; }
        public DateTime FechaCierre { get; set; }
        public int DiasFunnel { get; set; }
        public string UltimoComentario { get; set; }
    }
}
