using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class HerramientasService : IHerramientasService
    {
        private readonly IHerramientasData _herramientasData;

        public HerramientasService(IHerramientasData herramientasData)
        {
            _herramientasData = herramientasData;
        }
        public async Task<List<IngresosFunnelDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            return await _herramientasData.ConsultarIngresos(IdUsuario, IdEmpresa);
        }
    }
}
