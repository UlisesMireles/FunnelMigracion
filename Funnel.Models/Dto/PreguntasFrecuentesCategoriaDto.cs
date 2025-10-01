using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class PreguntasFrecuentesCategoriaDto : BaseOut
    {
        public int Id { get; set; }
        public int IdBot { get; set; }
        public string Asistente { get; set; } = string.Empty;
        public bool Documento { get; set; }
        public int IdCategoria { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string MensajePrincipal { get; set; } = string.Empty;
        public string Pregunta { get; set; } = string.Empty;
        public string Respuesta { get; set; } = string.Empty;
    }
}
