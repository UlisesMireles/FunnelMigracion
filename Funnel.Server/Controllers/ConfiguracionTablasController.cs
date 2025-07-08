using Funnel.Data.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfiguracionTablasController : Controller
    {
        private readonly IConfiguracionTablasData _configuracionTablasData;
        public ConfiguracionTablasController(IConfiguracionTablasData configuracionTablasData)
        {
            _configuracionTablasData = configuracionTablasData;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<ConfiguracionTablasDto>>> ObtenerConfiguracionTabla(int IdTabla, int IdUsuario)
        {
            var data = new RequestConfigracionTablaDto { IdTabla = IdTabla, IdUsuario = IdUsuario };
            var result = await _configuracionTablasData.ObtenerConfiguracionTabla(data);
            return Ok(result);
        }
        [HttpPost("[action]/")]
        public async Task<ActionResult<List<ConfiguracionTablasDto>>> GuardarConfiguracionTabla(RequestConfigracionTablaDto data)
        {
            var result = await _configuracionTablasData.GuardarConfiguracionTabla(data);
            return Ok(result);
        }
    }
}
