using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IProspectoData
    {
        public Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa);
        public Task<BaseOut> GuardarProspecto(ProspectoDTO request);
        public Task<List<ComboSectoresDto>> ComboSectores();
        Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa, string Anio);
        Task<List<AniosDto>> ConsultarAniosOportunidades(int idEmpresa);
        Task<List<AniosDto>> ConsultarAniosGraficas(int idEmpresa);
        Task ActualizarNivelInteres(int idProspecto, int idNivel);
    }
}
