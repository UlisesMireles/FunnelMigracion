
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic
{
    public class ConfiguracionTablasService : IConfiguracionTablasService
    {
        private readonly IConfiguracionTablasData _configuracionTablasData;
        public ConfiguracionTablasService(IConfiguracionTablasData configuracionTablasData)
        {
            _configuracionTablasData = configuracionTablasData;
        }
        public async Task<List<ConfiguracionTablasDto>> ObtenerConfiguracionTabla(RequestConfigracionTablaDto data)
        {
            return await _configuracionTablasData.ObtenerConfiguracionTabla(data);
        }

        public async Task<BaseOut> GuardarConfiguracionTabla(RequestConfigracionTablaDto data)
        {
            return await _configuracionTablasData.GuardarConfiguracionTabla(data);
        }
    }
}
