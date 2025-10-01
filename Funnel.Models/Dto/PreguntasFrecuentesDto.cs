using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class PreguntasFrecuentesDto : BaseOut
    {
        public int Id { get; set; }
        public int IdBot { get; set; }
        public string Asistente { get; set; } = string.Empty;
        public string Pregunta { get; set; } = string.Empty;
        public string Respuesta { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
        public Boolean Activo { get; set; }
        public int? IdCategoria { get; set; }
        public string Categoria { get; set; } = string.Empty;
        public Boolean Estatus { get; set; }
    }
}
