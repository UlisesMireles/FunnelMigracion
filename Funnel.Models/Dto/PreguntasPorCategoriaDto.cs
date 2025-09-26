namespace Funnel.Models.Dto
{
    public class PreguntasPorCategoriaDto
    {
        public string Pregunta { get; set; } = string.Empty;
        public string Respuesta { get; set; } = string.Empty;
        public bool YaSePregunto { get; set; }
    }
}
