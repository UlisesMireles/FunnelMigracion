using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using System.Reflection;
using Funnel.Logic.Utils;
using Funnel.Data;
using System.Diagnostics.Contracts;
namespace Funnel.Logic
{
    public class CategoriasService : ICategoriasService
    {
        private readonly ICategoriasRepository _categoriasData;

        public CategoriasService(ICategoriasRepository categoriasData)
        {
            _categoriasData = categoriasData;
        }

        public async Task<ListaCategoriasDto> CategoriaPorBot(int idBot)
        {
            return await _categoriasData.CategoriaPorBot(idBot);
        }

        public async Task<CategoriasDto> CategoriaPorId(int idCategoria)
        {
            return await _categoriasData.CategoriaPorId(idCategoria);
        }

        public async Task<ListaCategoriasDto> Categorias()
        {
            return await _categoriasData.Categorias();
        }

        public async Task<ListaPreguntasPorCategoriaDto> PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida()
        {
            return await _categoriasData.PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida();
        }
    }
}
