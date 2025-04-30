using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class OportunidadesReporteDto
    {
        public List<ColumnasPaginacion> Columnas { get; set; }
        public List<OportunidadesEnProcesoDto> Datos { get; set; }
        public string? Anio { get; set; }
    }
    public class ColumnasPaginacion
    {
        public bool groupColumn { get; set; }
        public bool isCheck { get; set; }
        public bool isIgnore { get; set; }
        public bool isTotal { get; set; }
        public string key { get; set; }
        public string tipoFormato { get; set; }
        public string valor { get; set; }
    }
}
