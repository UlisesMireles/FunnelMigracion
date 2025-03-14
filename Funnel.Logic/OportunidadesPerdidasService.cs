using System.Collections.Generic;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;

namespace Funnel.Logic
{
    public class OportunidadesPerdidasService : IOportunidadesPerdidasService
    {
        private readonly IOportunidadesPerdidasData _oportunidadesPerdidasData;

        public OportunidadesPerdidasService(IOportunidadesPerdidasData oportunidadesPerdidasData)
        {
            _oportunidadesPerdidasData = oportunidadesPerdidasData;
        }

        public async Task<List<OportunidadesPerdidasDto>> ObtenerOportunidadesPerdidas(int idUsuario, int idEstatusOportunidad, int idEmpresa)
        {
            return await _oportunidadesPerdidasData.ObtenerOportunidadesPerdidas(idUsuario, idEstatusOportunidad, idEmpresa);
        }
    }
}
