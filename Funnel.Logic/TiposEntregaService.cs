using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using Azure.Core;

namespace Funnel.Logic
{
    public class TiposEntregaService : ITiposEntregaService
    {
        private readonly ITipoEntregaData _tipoEntregaData;

        public TiposEntregaService(ITipoEntregaData tipoEntregaData)
        {
            _tipoEntregaData = tipoEntregaData;
        }

        public async Task<List<TipoEntregaDto>> ConsultarTiposEntrega(int IdTipoEntrega)
        {
            return await _tipoEntregaData.ConsultarTiposEntrega(IdTipoEntrega);
        }

        public async Task<BaseOut> GuardarTipoEntrega(TipoEntregaDto request)
        {
            BaseOut result = new BaseOut();
            var listaTipoEntrega = await _tipoEntregaData.ConsultarTiposEntrega((int)request.IdEmpresa);
            if (request.Bandera == "INSERT" && listaTipoEntrega.FirstOrDefault(v => v.Descripcion == request.Descripcion) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            return await _tipoEntregaData.GuardarTipoEntrega(request);
        }
    }
}
