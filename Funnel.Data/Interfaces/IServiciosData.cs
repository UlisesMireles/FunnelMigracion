using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data;

namespace Funnel.Data.Interfaces
{
    public interface IServiciosData
    {
        Task<List<ServicioDTO>> ConsultarServicios(int IdEmpresa);
        Task<BaseOut> CrearServicio(ServicioDTO servicio);
    }
}
