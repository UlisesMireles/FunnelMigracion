using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class DobleAutenticacionDto : BaseOut
    {
        public int Codigo { get; set; }
        public int TipoMensaje { get; set; }
        public string? Nombre { get; set; }
        public string? Apellidos { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public string? Empresa { get; set; }
        public string? SitioWeb { get; set; }
        public string? NumEmpleados { get; set; }

    }
    public class CodigoDosPasosDto
    {
        public string? Usuario { get; set; }
        public int Codigo { get; set; }
    }
}
