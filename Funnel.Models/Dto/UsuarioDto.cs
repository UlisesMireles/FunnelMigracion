using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class UsuarioDto : BaseOut
    {
        public int IdUsuario { get; set; }
        public string? TipoUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
    }
}
