using DinkToPdf.Contracts;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class EncuestaService : IEncuestaService
    {
        private readonly IEncuestaData _encuestaData;

        public EncuestaService(IEncuestaData encuestaData, IConverter converter, ILoginService loginService)
        {
            _encuestaData = encuestaData;
      
        }

        public async Task<List<EncuestaDto>> ConsultarPreguntasEncuesta()
        {
            return await _encuestaData.ConsultarPreguntasEncuesta();
        }
        public async Task<InsertaBitacoraPreguntasDto> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert)
        {
            return await _encuestaData.InsertaPreguntaBitacoraPreguntas(insert);
        }
    }

}
