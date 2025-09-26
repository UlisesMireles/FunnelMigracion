using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Models.Base;

namespace Funnel.Logic.Interfaces
{
    public interface ICategoriasService
    {
        public Task<ListaCategoriasDto> Categorias();
        public Task<ListaPreguntasPorCategoriaDto> PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida();
        public Task<CategoriasDto> CategoriaPorId(int idCategoria);
        public Task<ListaCategoriasDto> CategoriaPorBot(int idBot);
    }
}
