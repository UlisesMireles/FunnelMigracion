using DinkToPdf;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Interfaces
{
    public interface IHerramientasService
    {
        public Task<List<IngresosFunnelDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa);
        public Task<HtmlToPdfDocument> GenerarReporteIngresosUsuarios(IngresosFunnelReporteDTO ingresos, string RutaBase, string titulo);
        public Task<List<EjecucionProcesosReportesDTO>> ConsultarEjecucionProcesosPorEmpresa(int IdEmpresa);
        public Task<BaseOut> GuardarDiasReportesEstatus(EjecucionProcesosReportesDTO request, bool estatus);
        public Task<BaseOut> EnvioCorreosReporteSeguimiento(int IdEmpresa, int IdReporte, List<string> Correos);
        public Task<List<ComboCorreosUsuariosDTO>> ComboCorreosUsuariosActivos(int IdEmpresa);
    }
}
