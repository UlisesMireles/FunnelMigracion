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
    public class EmpresaService : IEmpresaService
    {
        private readonly IEmpresaData _empresaData;
        public EmpresaService(IEmpresaData empresaData)
        {
            _empresaData = empresaData;
        }
        public async Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request)
        {
            BaseOut result = new BaseOut();
            return await _empresaData.GuardarEmpresa(request);
        }
        public async Task<List<GuardarEmpresaDto>> ConsultarEmpresas()
        {
            return await _empresaData.ConsultarEmpresas();
        }
    }
}
