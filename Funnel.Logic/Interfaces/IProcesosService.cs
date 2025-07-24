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
        Task<List<PlantillasProcesosStageDTO>> ConsultarPlantillasProcesosEtapas();
        public Task<List<OportunidadesTarjetasDto>> InsertarModificarEtapa(List<OportunidadesTarjetasDto> etapas);
        public Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request);
        public Task<byte[]> GenerarReporteProcesos(ProcesosReportesDTO procesos, string RutaBase, string titulo, int IdEmpresa);
    }
}
