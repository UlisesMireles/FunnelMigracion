using Funnel.Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Funnel.Models.Dto;


namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : Controller
    {
        private readonly IPermisosService _permisosService;

        public PermisosController(IPermisosService permisosService)
        {
            _permisosService = permisosService;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<PermisosDto>>> ConsultarPermisos(int idEmpresa)
        {
            var respuesta = await _permisosService.ConsultarPermisos(idEmpresa);
            return Ok(respuesta);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<bool>> GuardarPermisos(List<PermisosDto> listPermisos)
        {
            var respuesta = await _permisosService.GuardarPermisos(listPermisos);
            return Ok(respuesta);
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<PermisosDto>>> ComboRoles(int idEmpresa)
        {
            var respuesta = await _permisosService.ComboRoles(idEmpresa);
            return Ok(respuesta);
        }
    }
}
