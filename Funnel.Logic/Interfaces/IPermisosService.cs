using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IPermisosService
    {
        public Task<List<PermisosDto>> ConsultarPermisos(int IdEmpresa);
    }
}
