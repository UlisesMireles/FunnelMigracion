using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Models.Base;
namespace Funnel.Logic.Interfaces
{
    public interface IPreguntasFrecuentesService
    {
        public Task<ListaPreguntasFrecuentesDto> PreguntasFrecuentes();
        public Task<PreguntasFrecuentesDto> PreguntasFrecuentesPorId(int id);
        public Task<ListaPreguntasFrecuentesCategoriaDto> ListaPreguntasFrecuentesCategoria();
    }
}
