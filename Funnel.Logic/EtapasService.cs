using DinkToPdf.Contracts;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class EtapasService : IEtapasService
    {
        private readonly IEtapasData _etapasData;
        private readonly ILoginService _loginService;
        private readonly IConverter _converter;

        public EtapasService(IEtapasData etapasData, IConverter converter, ILoginService loginService)
        {
            _etapasData = etapasData;
            _converter = converter;
            _loginService = loginService;
        }

        public async Task<BaseOut> GuardarEtapas(List<OportunidadesTarjetasDto> etapas)
        {
            BaseOut respuesta = new BaseOut();

            try
            {
                foreach (OportunidadesTarjetasDto item in etapas)
                {
                    if (item.Eliminado is not null && item.Eliminado == true && item.IdStage > 0)
                    {
                        BaseOut eliminado = new BaseOut();
                        //eliminado = await _etapasData.ModificacionesEtapa(item, "DELETE");
                    }
                    else if (item.Agregado is not null && item.Agregado == true && item.Eliminado == false)
                    {
                        BaseOut agregado = new BaseOut();
                        //agregado = await _etapasData.ModificacionesEtapa(item, "INSERT");
                    }
                    else if (item.Editado is not null && item.Editado == true && item.Eliminado == false && item.IdStage > 0)
                    {
                        BaseOut editado = new BaseOut();
                        //editado = await _etapasData.ModificacionesEtapa(item, "UPDATE");

                    }
                }
            }
            catch (Exception ex)
            {
                respuesta.ErrorMessage = ex.Message;
                respuesta.Result = false;
                return respuesta;
            }
            return respuesta;
        }
    }
}
