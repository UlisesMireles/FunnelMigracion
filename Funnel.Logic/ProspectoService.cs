using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class ProspectoService : IProspectosService
    {
        private readonly IProspectoData _ProspectoData;
        public ProspectoService(IProspectoData ProspectoData)
        {
            _ProspectoData = ProspectoData;
        }

        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            return await _ProspectoData.ComboSectores();
        }

        public async Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa)
        {
            return await _ProspectoData.ConsultarProspectos(IdEmpresa);
        }

        public async Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa)
        {
            return await _ProspectoData.ConsultarTopVeinte(IdEmpresa);
        }

        public async Task<BaseOut> GuardarProspecto(ProspectoDTO request)
        {
            BaseOut result = new BaseOut();
            //Validar que no exista registro con mismo nombre 
            var listaProspectos = await _ProspectoData.ConsultarProspectos((int)request.IdEmpresa);
            if(request.Bandera == "INSERT" && listaProspectos.FirstOrDefault(v => v.Nombre == request.Nombre) != null)
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
            return await _ProspectoData.GuardarProspecto(request);
        }
    }
}
