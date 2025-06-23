using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IEtapasData
    {
        public Task<BaseOut> ModificacionesEtapa(OportunidadesTarjetasDto request, string bandera);
    }
}
