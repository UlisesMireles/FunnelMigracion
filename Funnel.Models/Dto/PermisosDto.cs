namespace Funnel.Models.Dto
{
    public class PermisosDto
    {
        public string? Bandera { get; set; }
        public int? IdEmpresa { get; set; }
        public int? IdRol { get; set; }
        public bool? Estatus { get; set; }
        public int? IdPagina { get; set; }
        public string? Descripcion { get; set; }
        public int? IdMenu { get; set; }
        public string? Menu { get; set; }
        public string? Pagina { get; set; }
        public bool? Administrador { get; set; }
        public bool? Gerente { get; set; }
        public bool? Agente { get; set; }
        public bool? Invitado { get; set; }
        public string? Ruta { get; set; }
        public string? Icono { get; set; }

    }
    public class MenuPermisos
    {
        public int? IdMenu { get; set; }
        public string Nombre { get; set; }
        public string Ruta { get; set; }
        public string Tooltip { get; set; }
        public string Icono { get; set; }
        public List<PaginasDto> SubMenu { get; set; }
    }
    public class PaginasDto
    {
        public int? IdPagina { get; set; }
        public string Pagina { get; set; }
        public string Ruta { get; set; }
        public string TooltipMessage { get; set; }
        public bool HasIcon { get; set; }

    }
}
