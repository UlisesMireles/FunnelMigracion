using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;

namespace Funnel.Data.Interfaces
{
    public interface IOportunidadesPerdidasData
    {
        Task<List<OportunidadesPerdidasDto>> ObtenerOportunidadesPerdidas(int idUsuario, int idEstatusOportunidad, int idEmpresa);
    }
}
