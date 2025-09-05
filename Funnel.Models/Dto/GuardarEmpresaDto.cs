

using Microsoft.AspNetCore.Http;

namespace Funnel.Models.Dto
{
    public class GuardarEmpresaDto
    {
        public string? Bandera { get; set; }
        public int? IdEmpresa { get; set; }
        public string? NombreEmpresa { get; set; }
        public int IdAdministrador { get; set; }
        public int IdLicencia { get; set; }
        public string? Alias { get; set; }
        public string? Rfc { get; set; }
        public DateTime VInicio { get; set; }
        public DateTime VTerminacion { get; set; }
        public int UsuarioCreador { get; set; }
        public string? Nombre { get; set; }
        public string? ApellidoPaterno { get; set; }
        public string? ApellidoMaterno { get; set; }
        public string? Iniciales { get; set; }
        public string? Correo { get; set; }
        public string? Usuario { get; set; }
        public string? UrlSitio { get; set; }
        public int Activo { get; set; }
        public int? Estatus { get; set; }
        public bool PermitirDecimales { get; set; }
        public string Password { get; set; }
    }
}
