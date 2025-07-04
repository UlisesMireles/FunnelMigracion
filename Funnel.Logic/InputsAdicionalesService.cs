using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class InputsAdicionalesService : IInputsAdicionalesService
    {
        private readonly IInputsAdicionalesData _inputsAdicionalesData;
        public InputsAdicionalesService(IInputsAdicionalesData inputsAdicionalesData)
        {
            _inputsAdicionalesData = inputsAdicionalesData;
        }

        public async Task<List<InputAdicionalDTO>> ConsultarInputsAdicionales(int IdEmpresa, string TipoCatalogo)
        {
            return await _inputsAdicionalesData.ConsultarInputsAdicionales(IdEmpresa, TipoCatalogo);
        }

        public async Task<List<InputAdicionalDTO>> ConsultarInputsPorCatalogo(int IdEmpresa, string TipoCatalogo)
        {
            return await _inputsAdicionalesData.ConsultarInputsPorCatalogo(IdEmpresa, TipoCatalogo);
        }

        public async Task<List<InputAdicionalDataDTO>> ConsultarDataInputsAdicionales(int IdEmpresa, string TipoCatalogo, int IdReferencia)
        {
            return await _inputsAdicionalesData.ConsultarDataInputsAdicionales(IdEmpresa, TipoCatalogo, IdReferencia);
        }

        public async Task<BaseOut> GuardarInputsAdicionales(List<InputAdicionalDTO> listaInputs)
        {
            BaseOut result = new BaseOut();
            if (listaInputs.Count > 0)
            {
                return await _inputsAdicionalesData.GuardarInputsAdicionales(listaInputs);
            }
            result.ErrorMessage = "Error al guardar inputs adicionales: No se seleccionaron inputs.";
            result.Result = false;
            return result;
        }

        public async Task<BaseOut> GuardarInputsAdicionalesData(List<InputAdicionalDataDTO> listaInputsData)
        {
            BaseOut result = new BaseOut();
            if (listaInputsData.Count > 0)
            {
                return await _inputsAdicionalesData.GuardarInputsAdicionalesData(listaInputsData);
            }
            result.ErrorMessage = "Error al guardar información adicional: No se envío ningún dato.";
            result.Result = false;
            return result;
        }
    }
}
