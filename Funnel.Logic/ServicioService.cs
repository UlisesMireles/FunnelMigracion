using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using Azure.Core;

namespace Funnel.Logic
{
    public class ServiciosService : IServiciosService  
    {
        private readonly IServiciosData _serviciosData;  

        public ServiciosService(IServiciosData serviciosData)  
        {
            _serviciosData = serviciosData;
        }

        public async Task<List<ServicioDTO>> ConsultarServicios(int IdTipoProyecto)
        {
            return await _serviciosData.ConsultarServicios(IdTipoProyecto);
        }

        public async Task<BaseOut> GuardarServicio(ServicioDTO request)
        {
            BaseOut result = new BaseOut();
            var listaServicios = await _serviciosData.ConsultarServicios((int)request.IdEmpresa);
            if (request.Bandera == "INSERT" && listaServicios.FirstOrDefault(v => v.Descripcion == request.Descripcion) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            return await _serviciosData.GuardarServicio(request);
        }
    }
}
