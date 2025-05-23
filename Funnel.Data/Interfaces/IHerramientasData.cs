using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IHerramientasData
    {
        public Task<List<IngresosFunnelDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa);
        public Task<List<EjecucionProcesosReportesDTO>> ConsultarEjecucionProcesosPorEmpresa(int IdEmpresa);
        public Task<BaseOut> GuardarDiasReportesEstatus(EjecucionProcesosReportesDTO request, string Correos);
        public Task<BaseOut> EnvioCorreosReporteSeguimiento(int IdEmpresa, int IdReporte, string Correos);
        public Task<List<ComboCorreosUsuariosDTO>> ComboCorreosUsuariosActivos(int IdEmpresa);
        public Task<List<ComboCorreosUsuariosDTO>> ConsultarCorreosUsuariosReporteAuto(int IdEmpresa, int IdReporte);
    }
}
