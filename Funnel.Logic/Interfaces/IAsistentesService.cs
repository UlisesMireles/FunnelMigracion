using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Logic.Interfaces
{
    public interface IAsistentesService
    {
        public Task<BaseOut> ActualizarDocumento(ConsultaAsistente consultaAsistente);
        public Task<ConsultaAsistente> AsistenteOpenAIAsync(ConsultaAsistente consultaAsistente);
        public Task LimpiarCacheAsistente(int userId, int idBot);
    }
}
