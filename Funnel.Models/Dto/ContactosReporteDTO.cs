using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ContactosReporteDTO
    {
        public List<ColumnasPaginacion> Columnas { get; set; }
        public List<ContactoDto> Datos { get; set; }
    }
}
