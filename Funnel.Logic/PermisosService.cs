using Funnel.Data;
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
    public class PermisosService : IPermisosService
    {
        private readonly IPermisosData _permisosData;
        public PermisosService(IPermisosData permisosData)
        {
            _permisosData = permisosData;
        }
        public async Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa)
        {
            return await _permisosData.ConsultarPermisos(IdEmpresa);
        }
    }
}
