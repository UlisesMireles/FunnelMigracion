using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data;

namespace Funnel.Data.Interfaces
{
    public interface ITipoEntregaData
    {
        Task<List<TipoEntregaDto>> ConsultarTiposEntrega(int IdEmpresa);
        Task<BaseOut> GuardarTipoEntrega(TipoEntregaDto tipoEntrega);
    }
}
