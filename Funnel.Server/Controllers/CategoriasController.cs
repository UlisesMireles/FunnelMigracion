using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using Funnel.Logic;
namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : Controller
    {
        private readonly ICategoriasService _categoriasService;

        public CategoriasController(ICategoriasService categoriasService)
        {
            _categoriasService = categoriasService;
        }

        [HttpGet("Categorias")]
        public async Task<ActionResult<ListaCategoriasDto>> Categorias()
            => Ok(await _categoriasService.Categorias());

        [HttpGet("CategoriaPorId/{idCategoria}")]
        public async Task<ActionResult<CategoriasDto>> CategoriaPorId(int idCategoria)
           => Ok(await _categoriasService.CategoriaPorId(idCategoria));

        [HttpGet("PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida")]
        public async Task<ActionResult<ListaPreguntasPorCategoriaDto>> PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida()
            => Ok(await _categoriasService.PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida());


        [HttpGet("CategoriaPorBot/{idBot}")]
        public async Task<ActionResult<CategoriasDto>> CategoriaPorBot(int idBot)
           => Ok(await _categoriasService.CategoriaPorBot(idBot));
    }
}
