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
        Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa, string Anio);
        public Task<byte[]> GenerarReporteProspectos(ProspectosReporteDTO prospectos, string RutaBase, string titulo, int IdEmpresa);
        public Task<byte[]> GenerarReporteTop20(ProspectosReporteDTO prospectos, string RutaBase, string titulo, int IdEmpresa);
        Task<List<AniosDto>> ConsultarAniosOportunidades(int idEmpresa);
        Task<List<AniosDto>> ConsultarAniosGraficas(int idEmpresa);
    }
}
