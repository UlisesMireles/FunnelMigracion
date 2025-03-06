using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IOportunidadesEnProcesoService
    {
        public Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus);
        public Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request);
    }
}
