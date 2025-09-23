
namespace Funnel.Models.Dto
{
    public class UsuarioLoginDto
    {
        public int IdUsuario { get; set; }
        public int? IdEmpresa { get; set; }
        public string Usuario { get; set; }
        public string Password { get; set; }
        public string? SesionId { get; set; }
        public string? MotivoCerrarSesion { get; set; }
        public string? Ip { get; set; }
        public string? Ubicacion { get; set; }
    }
}
