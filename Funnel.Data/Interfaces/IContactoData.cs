using Funnel.Models.Dto;

namespace Funnel.Data.Interfaces
{
    public interface IContactoData
    {
        public Task<List<ContactoDto>> ConsultarContacto(int idEmpresa);
    }
}
