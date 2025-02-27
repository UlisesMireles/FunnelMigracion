using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IProspectoData
    {
        public Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa);
        public Task<BaseOut> GuardarProspecto(ProspectoDTO request);
        public Task<List<ComboSectoresDto>> ComboSectores();
    }
}
