using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IGraficasService
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
        public Task<List<AniosDto>> Anios(int IdEmpresa, int IdEstatusOportunidad);
        Task<List<GraficaDto>> ObtenerGraficaGanadasAnio(RequestGrafica data);
    }
}
