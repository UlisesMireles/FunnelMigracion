using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ConfiguracionTablasDto
    {
        public int IdTabla { get; set; }
        public int IdColumna { get; set; }
        public int IdUsuario { get; set; }
        public string Key { get; set; }
        public string Valor { get; set; }
        public string TipoFormato { get; set; }
        public bool IsCheck { get; set; }
        public bool IsIgnore { get; set; }
        public bool IsTotal { get; set; }
        public bool GroupColumn { get; set; }
        public int Orden { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
    public class RequestConfigracionTablaDto
    {
        public int IdTabla { get; set; }
        public int IdUsuario { get; set; }
        public List<ConfiguracionTablasDto> ConfiguracionTabla { get; set; }
    }
}
