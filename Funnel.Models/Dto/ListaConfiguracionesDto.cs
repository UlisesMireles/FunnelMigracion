using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class ListaConfiguracionesDto : BaseOut
    {
        public List<ConfiguracionDto>? Configuraciones { get; set; }
    }
}
