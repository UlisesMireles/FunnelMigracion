using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenciasController : Controller
    {
        private readonly ILicenciasService _licenciasService;
        public LicenciasController(ILicenciasService licenciasService)
        {
            _licenciasService = licenciasService;
        }
        [HttpGet("[action]/")]
        public async Task<ActionResult<List<LicenciasDto>>> ConsultarLicencias()
        {
            var result = await _licenciasService.ConsultarLicencias();
            return Ok(result);
        }
    }
}
