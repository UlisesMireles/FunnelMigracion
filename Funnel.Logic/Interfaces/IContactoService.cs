using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Models.Base;

namespace Funnel.Logic.Interfaces
{
    public interface IContactoService
    {
        public Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa);
        public Task<BaseOut> GuardarContacto(ContactoDto request);
        public Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa);
    }
}
