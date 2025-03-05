using Funnel.Data;
using Funnel.Logic;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiciosController : Controller
    {
        private readonly IServiciosService _serviciosService;

        public ServiciosController(IServiciosService serviciosService)
        {
            _serviciosService = serviciosService;
        }

        [HttpGet("[action]/{idEmpresa}")]
        public async Task<ActionResult<List<ServicioDTO>>> ConsultarServicios(int IdEmpresa)
        {
            var respuesta = await _serviciosService.ConsultarServicios(IdEmpresa);
            return Ok(respuesta);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<BaseOut>> GuardarServicio(ServicioDTO servicio)

        {
            var resultado = await _serviciosService.GuardarServicio(servicio);

                return Ok(resultado);

        }

    }
}