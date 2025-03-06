using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic
{
    public class OportunidadesEnProcesoService : IOportunidadesEnProcesoService
    {
        private readonly IOportunidadesEnProcesoData _oportunidadesData;
        public OportunidadesEnProcesoService(IOportunidadesEnProcesoData oportunidadesData)
        {
            _oportunidadesData = oportunidadesData;
        }
        public async Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus)
        {
            return await _oportunidadesData.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, IdEstatus);
        }

        public async Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            return await _oportunidadesData.GuardarOportunidad(request);
        }
    }
}
