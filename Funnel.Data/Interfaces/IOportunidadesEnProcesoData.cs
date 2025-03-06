using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Data.Interfaces
{
    public interface IOportunidadesEnProcesoData
    {
        public Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus);
        public Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request);
    }
}
