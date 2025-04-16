using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ServiciosReporteDTO
    {
        public List<ColumnasPaginacion> Columnas { get; set; }
        public List<ServicioDTO> Datos { get; set; }
    }
}
