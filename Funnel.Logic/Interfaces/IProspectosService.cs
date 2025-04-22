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
    public interface IProspectosService
    {
        public Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa);
        public Task<BaseOut> GuardarProspecto(ProspectoDTO request);
        public Task<List<ComboSectoresDto>> ComboSectores();
        Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa);
        public Task<HtmlToPdfDocument> GenerarReporteProspectos(ProspectosReporteDTO prospectos, string RutaBase, string titulo);
        public Task<HtmlToPdfDocument> GenerarReporteTop20(ProspectosReporteDTO prospectos, string RutaBase, string titulo);
    }
}
