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
        [HttpGet]
        public async Task<ActionResult<List<PermisosDto>>> ConsultarPermisos(int idEmpresa)
        {
            var respuesta = await _permisosService.ConsultarPermisos(idEmpresa);
            return Ok(respuesta);
        }
    }
}
