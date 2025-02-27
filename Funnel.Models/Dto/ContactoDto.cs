namespace Funnel.Models.Dto
{
    public class ContactoDto
    {
        public int IdContactoProspecto { get; set; }
        public string? NombreCompleto { get; set; }
        public string? Nombre { get; set; }
        public string? Apellidos { get; set; }
        public string? Telefono { get; set; }
        public string? CorreoElectronico { get; set; }
        public int? Estatus { get; set; }
        public string? DesEstatus { get; set; }
        public string? Prospecto { get; set; }
        public int? IdProspecto { get; set; }
        public int? IdEmpresa { get; set; }
    }
}
