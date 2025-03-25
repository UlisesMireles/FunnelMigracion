using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IPermisosService
    {
        public Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa);
        public Task<BaseOut> GuardarPermisos(List<PermisosDto> listPermisos);
        public Task<List<PermisosDto>> ComboRoles(int IdEmpresa);
    }
}
