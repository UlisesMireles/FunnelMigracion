using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Interfaces
{
    public interface IEncuestaService
    {
        public Task<List<EncuestaDto>> ConsultarPreguntasEncuesta();
        public Task<InsertaBitacoraPreguntasDto> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert);
    }
}
