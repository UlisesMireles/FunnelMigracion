using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Interfaces
{
    public interface IInputsAdicionalesService
    {
        Task<List<InputAdicionalDTO>> ConsultarInputsAdicionales(int IdEmpresa, string TipoCatalogo);
        Task<List<InputAdicionalDTO>> ConsultarInputsPorCatalogo(int IdEmpresa, string TipoCatalogo);
        Task<List<InputAdicionalDataDTO>> ConsultarDataInputsAdicionales(int IdEmpresa, string TipoCatalogo, int IdReferencia);
        Task<BaseOut> GuardarInputsAdicionales(List<InputAdicionalDTO> listaInputs, int IdEmpresa);
        Task<BaseOut> GuardarInputsAdicionalesData(List<InputAdicionalDataDTO> listaInputsData);
    }
}
