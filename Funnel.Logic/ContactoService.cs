﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;

namespace Funnel.Logic
{
    public class ContactoService : IContactoService
    {
        private readonly IContactoData _contactoData;
        public ContactoService(IContactoData contactoData)
        {
            _contactoData = contactoData;
        }
        public async Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa)
        {
            return await _contactoData.ConsultarContacto(IdEmpresa);
        }

        public async Task<BaseOut> GuardarContacto(ContactoDto request)
        {
            BaseOut result = new BaseOut();
            //Validar que no exista registro con mismo nombre 
            var listaProspectos = await _contactoData.ConsultarContacto((int)request.IdEmpresa);
            if (request.Bandera == "INSERT" && listaProspectos.FirstOrDefault(v => v.Nombre == request.Nombre) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            if (request.Bandera == "UPDATE" && listaProspectos.FirstOrDefault(v => v.Nombre == request.Nombre && v.IdProspecto != request.IdProspecto) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            return await _contactoData.GuardarContacto(request);
        }
    }
}
