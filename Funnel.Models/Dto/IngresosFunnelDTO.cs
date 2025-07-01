using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class IngresosFunnelDTO
    {
        public string? Bandera { get; set; }
        public int IdUsuario { get; set; }
        public int IdEmpresa { get; set; }
        public string Usuario { get; set; }
        public DateTime FechaIngreso { get; set; }
    }
}
