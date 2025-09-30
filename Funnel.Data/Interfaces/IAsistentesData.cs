using Funnel.Models.Base;
using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface IAsistentesData
    {
        public Task<ConfiguracionDto?> ObtenerConfiguracionPorIdBotAsync(int idBot);
        public Task<BaseOut> GuardarFileIdLeadEisei(int idBot, string fileId);
        public Task<InsertaBitacoraPreguntasDto> InsertaPreguntaBitacoraPreguntas(InsertaBitacoraPreguntasDto insert);
        public Task<List<PreguntasFrecuentesDto>> ObtenerPreguntasFrecuentesAsync(int idBot);
        public Task<List<InstruccionesAdicionalesDto>> ObtenerInstruccionesAdicionalesPorIdBot(int idBot);
        public Task<ListaAsistentes> Asistentes();
        public Task<VersionAsistentesDto> ObtenerVersionArquitectura();
    }
}
