using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Funnel.Data.Interfaces;

namespace Funnel.Logic
{
    public class ContactoService : IContactoService
    {
        private readonly IContactoData _contactoData;
        public ContactoService(IContactoData contactoData)
        {
            _contactoData = contactoData;
        }
        public async Task<List<ContactoDto>> ConsultarContacto(int idEmpresa)
        {
            return await _contactoData.ConsultarContacto(idEmpresa);
        }
    }
}
