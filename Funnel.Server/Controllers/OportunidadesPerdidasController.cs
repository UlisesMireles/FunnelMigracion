using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OportunidadesPerdidasController : ControllerBase
    {
        private readonly IOportunidadesPerdidasService _oportunidadesPerdidasService;

        public OportunidadesPerdidasController(IOportunidadesPerdidasService oportunidadesPerdidasService)
        {
            _oportunidadesPerdidasService = oportunidadesPerdidasService;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<List<OportunidadesPerdidasDto>>> ObtenerOportunidadesPerdidas(int idUsuario, int idEstatusOportunidad, int idEmpresa)
        {
            var result = await _oportunidadesPerdidasService.ObtenerOportunidadesPerdidas(idUsuario, idEstatusOportunidad, idEmpresa);
            return Ok(result);
        }
    }
}
