using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
namespace Funnel.Logic
{
    public class GraficasService : IGraficasService
    {
        private readonly IGraficasData _graficasData;
        public GraficasService(IGraficasData graficasData)
        {
            _graficasData = graficasData;
        }
        public async Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaOportunidades(data);
        }
        public async Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaAgentes(data);
        }
        public async Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data)
        {
            return await _graficasData.ObtenerAgentes(data);
        }
        public async Task<List<GraficaDto>>ObtenerGraficaGanadasAnio(RequestGrafica data)
        {
            return await _graficasData.ObtenerGraficaGanadasAnio(data);
        }
    }
}
