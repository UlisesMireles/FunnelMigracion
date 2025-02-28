using Funnel.Data;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Funnel.Logic.Interfaces
{
    public interface IServiciosService
    {
        Task<List<ServiciosDTO>> ConsultarServicios(int IdEmpresa);
    }
}
