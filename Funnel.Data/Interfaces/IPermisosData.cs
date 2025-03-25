using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IPermisosData
    {
        public Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa);
    }
}
