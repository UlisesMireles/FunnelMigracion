using DinkToPdf;
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
    }
}
