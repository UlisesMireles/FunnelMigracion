using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IPreguntasFrecuentesRepository
    {
        public Task<ListaPreguntasFrecuentesDto> PreguntasFrecuentes();
        public Task<PreguntasFrecuentesDto> PreguntasFrecuentesPorId(int id);
        public Task<ListaPreguntasFrecuentesCategoriaDto> ListaPreguntasFrecuentesCategoria();
    }
}
