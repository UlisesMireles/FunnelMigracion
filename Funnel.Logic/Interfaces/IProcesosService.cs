using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Interfaces
{
    public interface IProcesosService
    {
        Task<List<ProcesosDTO>> ConsultarProcesos(int IdEmpresa);
        Task<ProcesosDTO> ConsultarEtapasPorProceso(int IdProceso);
        public Task<List<OportunidadesTarjetasDto>> InsertarModificarEtapa(List<OportunidadesTarjetasDto> etapas);
        public Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request);
    }
}
