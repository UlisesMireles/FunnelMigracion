using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IInputsAdicionalesData
    {
        Task<List<InputAdicionalDTO>> ConsultarInputsAdicionales(int IdEmpresa);
        Task<List<InputAdicionalDTO>> ConsultarInputsPorCatalogo(int IdEmpresa, string TipoCatalogo);
        Task<List<InputAdicionalDataDTO>> ConsultarDataInputsAdicionales(int IdEmpresa, string TipoCatalogo, int IdReferencia);
        Task<BaseOut> GuardarInputsAdicionales(List<InputAdicionalDTO> listaInputs);
        Task<BaseOut> GuardarInputsAdicionalesData(List<InputAdicionalDataDTO> listaInputsData);
    }
}
