using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InputsAdicionalesController : Controller
    {
        private readonly IInputsAdicionalesService _inputsAdicionalesService;

        public InputsAdicionalesController(IInputsAdicionalesService inputsAdicionalesService)
        {
            _inputsAdicionalesService = inputsAdicionalesService;
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<InputAdicionalDTO>>> ConsultarInputsAdicionales(int IdEmpresa)
        {
            var respuesta = await _inputsAdicionalesService.ConsultarInputsAdicionales(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<InputAdicionalDTO>>> ConsultarInputsPorCatalogo(int IdEmpresa, string TipoCatalogo)
        {
            var respuesta = await _inputsAdicionalesService.ConsultarInputsPorCatalogo(IdEmpresa, TipoCatalogo);
            return Ok(respuesta);
        }

        [HttpGet("[action]/")]
        public async Task<ActionResult<List<InputAdicionalDataDTO>>> ConsultarDataInputsAdicionales(int IdEmpresa, string TipoCatalogo, int IdReferencia)
        {
            var respuesta = await _inputsAdicionalesService.ConsultarDataInputsAdicionales(IdEmpresa, TipoCatalogo, IdReferencia);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarInputsAdicionales([FromBody] List<InputAdicionalDTO> listaInputs)
        {
            var respuesta = await _inputsAdicionalesService.GuardarInputsAdicionales(listaInputs);
            return Ok(respuesta);
        }

        [HttpPost("[action]/")]
        public async Task<ActionResult<BaseOut>> GuardarInputsAdicionalesData(List<InputAdicionalDataDTO> listaInputsData)
        {
            var respuesta = await _inputsAdicionalesService.GuardarInputsAdicionalesData(listaInputsData);
            return Ok(respuesta);
        }
    }
}
