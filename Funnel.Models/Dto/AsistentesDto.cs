namespace Funnel.Models.Dto
{
    public class AsistentesDto
    {
        public int IdBot { get; set; }
        public string NombreAsistente { get; set; } = string.Empty;
        public bool Documento { get; set; }
        public string NombreDocumento { get; set; } = string.Empty;
        public DateTime FechaModificacion { get; set; }
        public string NombreTablaAsistente { get; set; } = string.Empty;
        public string MensajePrincipalAsistente { get; set; } = string.Empty;
        public string UltimoNombreDocumento { get; set; } = string.Empty;
        public decimal TamanoUltimoDocumento { get; set; }
        public string RealizadoPor { get; set; } = string.Empty;
        public int IdAdministrador { get; set; }
        public string RutaDocumento { get; set; } = string.Empty;
    }
}