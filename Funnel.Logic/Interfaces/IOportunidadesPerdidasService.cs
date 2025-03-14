using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IOportunidadesPerdidasService
    {
        Task<List<OportunidadesPerdidasDto>> ObtenerOportunidadesPerdidas(int idUsuario, int idEstatusOportunidad, int idEmpresa);
    }
}
