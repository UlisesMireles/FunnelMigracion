using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class UsuarioDto : BaseOut
    {
        public int IdUsuario { get; set; }
        public string? Usuario { get; set; }
        public string? Password { get; set; }
        public string? TipoUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Alias { get; set; }
        public int IdEmpresa { get; set; }
        public int IdRol { get; set; }
    }
}
