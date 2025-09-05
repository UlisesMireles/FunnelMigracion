using Funnel.Models.Base;
using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IEmpresaData
    {
        public Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request);

    }
}
