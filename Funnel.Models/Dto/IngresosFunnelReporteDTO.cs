using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class IngresosFunnelReporteDTO
    {
        public List<ColumnasPaginacion> Columnas { get; set; }
        public List<IngresosFunnelDTO> Datos { get; set; }
        public string Anio { get; set; }
    }
}
