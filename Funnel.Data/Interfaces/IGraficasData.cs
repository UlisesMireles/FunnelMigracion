using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IGraficasData
    {
        Task<List<GraficaDto>> ObtenerGraficaOportunidades(RequestGrafica data);
        Task<List<GraficaDto>> ObtenerGraficaAgentes(RequestGrafica data);
        Task<List<AgenteDto>> ObtenerAgentes(RequestGrafica data);
        public Task<List<AniosDto>> Anios(int idEmpresa, int idEstatusOportunidad);
        Task<List<GraficaDto>> ObtenerGraficaGanadasAnio(RequestGrafica data);

    }
}
