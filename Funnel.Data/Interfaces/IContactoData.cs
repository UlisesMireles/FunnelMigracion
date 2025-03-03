using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Data.Interfaces
{
    public interface IContactoData
    {
        public Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa);
        public Task<BaseOut> GuardarContacto(ContactoDto request);
        public Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa);
    }
}
