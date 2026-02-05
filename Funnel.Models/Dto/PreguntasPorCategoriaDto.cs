using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class PreguntasPorCategoriaDto : BaseOut
    {
        public string Pregunta { get; set; } = string.Empty;
        public string Respuesta { get; set; } = string.Empty;
        public bool YaSePregunto { get; set; }
    }
}
