using Funnel.Models.Base;
using Microsoft.AspNetCore.Http;

namespace Funnel.Models.Dto
{
    public class UsuarioDto : BaseOut
    {
        public string? Bandera { get; set; }
        public int IdUsuario { get; set; }
        public string? Usuario { get; set; }
        public string? Password { get; set; }
        public string? TipoUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Alias { get; set; }
        public int? IdEmpresa { get; set; }
        public string? Empresa { get; set; }
        public int IdRol { get; set; }
        public int? IdTipoUsuario { get; set; }
        public string? Descripcion { get; set; }
        public string? ApellidoPaterno { get; set; }
        public string? ApellidoMaterno { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? Estatus { get; set; }
        public string? DesEstatus { get; set; }
        public string? ArchivoImagen { get; set; }
        public int? UsuarioCreador { get; set; }
        public string? CodigoAutenticacion { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? Iniciales { get; set; }
        public int? IdAdministrador { get; set; }
        public string? Clave { get; set; }
        public bool? Activo { get; set; }
        public int SuperAdministrador { get; set; }
        public int Id { get; set; }
        public IFormFile? Imagen { get; set; }
        public string? Licencia { get; set; }
        public int? CantidadUsuarios { get; set; }
        public int? CantidadOportunidades { get; set; }
        public string? SesionId { get; set; }
        public string? MotivoCerrarSesion { get; set; }
        public bool? PermitirDecimales { get; set; }
        public string? Telefono { get; set; }   
        public int? IdPuesto { get; set; }
        public string? Puesto { get; set; }

    }
}
