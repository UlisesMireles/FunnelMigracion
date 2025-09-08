using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using Funnel.Logic;
namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaController : Controller
    {
        private readonly IEmpresaService _empresaService;
        public EmpresaController(IEmpresaService empresaService)
        {
            _empresaService = empresaService;
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarEmpresa(GuardarEmpresaDto request)
        {
            var result = await _empresaService.GuardarEmpresa(request);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult> GuardarRegistroTemporal(GuardarRegistroTemporalDto request)
        {
            var result = await _empresaService.GuardarRegistroTemporal(request);
            return Ok(result);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult> ConsultarEmpresas()
        {
            var result = await _empresaService.ConsultarEmpresas();
            return Ok(result);
        }
    }
}
