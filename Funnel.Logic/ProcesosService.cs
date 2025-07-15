using Funnel.Data;
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
    public class ProcesosService : IProcesosService
    {
        private readonly IProcesosData _procesosData;

        public ProcesosService(IProcesosData ProcesosData)
        {
            _procesosData = ProcesosData;
        }

        public async Task<ProcesosDTO> ConsultarEtapasPorProceso(int IdProceso)
        {
            return await _procesosData.ConsultarEtapasPorProceso(IdProceso);
        }

        public async Task<List<ProcesosDTO>> ConsultarProcesos(int IdEmpresa)
        {
            return await _procesosData.ConsultarProcesos(IdEmpresa);
        }

        public async Task<List<OportunidadesTarjetasDto>> InsertarModificarEtapa(List<OportunidadesTarjetasDto> etapas)
        {
            BaseOut guardado;

            foreach (OportunidadesTarjetasDto item in etapas)
            {
                if (item.Agregado is not null && item.Agregado == true && item.Eliminado == false && item.IdStage == 0)
                {
                    guardado = await _procesosData.InsertarModificarEtapa(item, "INSERTAR-ETAPA");
                    item.IdStage = guardado.Id;
                }
                else if (item.Editado is not null && item.Editado == true && item.Eliminado == false && item.IdStage > 0)
                {
                    guardado = await _procesosData.InsertarModificarEtapa(item, "UPDATE-ETAPA");
                    item.IdStage = guardado.Id;
                }
            }
            return etapas;
        }

        public async Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request)
        {
            BaseOut result = new BaseOut();
            if (request.Etapas.Count < 3 || request.Etapas.Count > 7)
            {
                result.ErrorMessage = "Error al guardar proceso: Deben seleccionarse minímo 3 etapas o máximo 7 etapas.";
                result.Result = false;
                return result;
            }

            //Insertar o actulizar Etapas
            request.Etapas = await InsertarModificarEtapa(request.Etapas);

            //Insertar o actualizar datos de Proceso, y etapas eliminadas del proceso
            return await _procesosData.InsertarModificarProcesoEtapa(request);

            
        }
    }
}
