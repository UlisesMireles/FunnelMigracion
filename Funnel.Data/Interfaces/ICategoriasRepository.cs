using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface ICategoriasRepository
    {
        public Task<ListaCategoriasDto> Categorias();
        public Task<ListaPreguntasPorCategoriaDto> PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida();
        public Task<CategoriasDto> CategoriaPorId(int idCategoria);
        public Task<ListaCategoriasDto> CategoriaPorBot(int idBot);
    }
}
