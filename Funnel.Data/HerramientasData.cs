using Funnel.Data.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data
{
    internal class HerramientasData : IHerramientasData
    {
        public Task<List<IngresosFunnelDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            throw new NotImplementedException();
        }
    }
}
