using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;

namespace Funnel.Logic
{
    public class ServiciosService : IServiciosService  // Se corrigió el nombre de la clase
    {
        private readonly IServiciosData _serviciosData;  // Se corrigió el nombre de la variable

        public ServiciosService(IServiciosData serviciosData)  // Se corrigió el constructor
        {
            _serviciosData = serviciosData;
        }

        public async Task<List<ServiciosDTO>> ConsultarServicios(int IdTipoProyecto)
        {
            return await _serviciosData.ConsultarServicios(IdTipoProyecto);
        }
    }
}