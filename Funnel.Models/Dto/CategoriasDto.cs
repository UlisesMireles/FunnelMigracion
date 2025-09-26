namespace Funnel.Models.Dto
{
    public class CategoriasDto 
    {
        public int IdCategoria { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string MensajePrincipal { get; set; } = string.Empty;
        public int LimitePreguntas { get; set; }
        public int? IdBot { get; set; }
        public string? NombreBot { get; set; } = string.Empty;
        public int TotalPreguntas { get; set; }
    }
}
