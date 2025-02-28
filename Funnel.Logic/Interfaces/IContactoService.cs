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
        Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa);
        Task<BaseOut> GuardarContacto(ContactoDto request);
    }
}
