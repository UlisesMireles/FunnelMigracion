namespace Funnel.Models.Dto
{
    public class AsitenteCategoriasDto
    {
        public int IdBot { get; set; }
        public string Asistente { get; set; } = string.Empty;
        public bool Documento { get; set; }
        public List<CategoriaPregutasDto>? PreguntasPorCategoria { get; set; }
    }
}
