using Funnel.Models.Base;
using Funnel.Models.Dto;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IOportunidadesEnProcesoData
    {
        public Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus);
        public Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request);
        public Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa);
        public Task<List<ComboServiciosDto>> ComboServicios(int IdEmpresa);
        public Task<List<ComboEtapasDto>> ComboEtapas(int IdEmpresa);
        public Task<List<ComboEntregasDto>> ComboEntregas(int IdEmpresa);
        public Task<List<ComboEjecutivosDto>> ComboEjecutivos(int IdEmpresa);
        public Task<List<ContactoDto>> ComboContactos(int IdEmpresa, int IdProspecto);
    }
}