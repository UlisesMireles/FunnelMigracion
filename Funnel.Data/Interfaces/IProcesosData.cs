using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IProcesosData
    {
        Task<List<ProcesosDTO>> ConsultarProcesos(int IdEmpresa);
        Task<ProcesosDTO> ConsultarEtapasPorProceso(int IdProceso);
        Task<List<PlantillasEtapasDTO>> ConsultarPlantillasProcesosEtapas();
        Task<BaseOut> InsertarModificarEtapa(OportunidadesTarjetasDto request, string bandera);
        Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request);
    }
}
