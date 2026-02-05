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
    public class PreguntasFrecuentesService : IPreguntasFrecuentesService
    {
        private readonly IPreguntasFrecuentesRepository _preguntasFrecuentesData;
        //private readonly IConfiguracionesRepository _configuracionesData;

        public PreguntasFrecuentesService(IPreguntasFrecuentesRepository preguntasFrecuentesData /*, IConfiguracionesRepository configuracionesData*/)
        {
            _preguntasFrecuentesData = preguntasFrecuentesData;
            //_configuracionesData = configuracionesData;
        }

      
        //public async Task<GeneraConsultaDto> GeneraConsulta(GeneraConsultaDto dto)
        //{
        //    ConfiguracionDto config = await _configuracionesData.ConfiguracionPorIdBot(dto.IdBot);
        //    return await AsistenteAccionesRiesgos.GeneraConsultaAdmin(dto, config);
        //}

       

        public async Task<ListaPreguntasFrecuentesCategoriaDto> ListaPreguntasFrecuentesCategoria()
        {
            return await _preguntasFrecuentesData.ListaPreguntasFrecuentesCategoria();
        }

      

        public async Task<ListaPreguntasFrecuentesDto> PreguntasFrecuentes()
        {
            return await _preguntasFrecuentesData.PreguntasFrecuentes();
        }

        public async Task<PreguntasFrecuentesDto> PreguntasFrecuentesPorId(int id)
        {
            return await _preguntasFrecuentesData.PreguntasFrecuentesPorId(id);
        }
    }
}
