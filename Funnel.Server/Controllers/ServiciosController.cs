using Funnel.Logic;
using Funnel.Logic.Interfaces;
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

        [HttpGet("[action]/{idTipoProyecto}")]
        public async Task<ActionResult<List<ServiciosDTO>>> ConsultarServicios(int idTipoProyecto)
        {
            var respuesta = await _serviciosService.ConsultarServicios(idTipoProyecto);
            return Ok(respuesta);
        }
    }
}