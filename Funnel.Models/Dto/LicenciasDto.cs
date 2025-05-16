
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class LicenciasDto : BaseOut
    {
        public string? Bandera { get; set; }
        public int? IdLicencia { get; set; }
        public string? NombreLicencia { get; set; }
        public int? CantidadUsuarios { get; set; }
        public int? CantidadOportunidades { get; set; }
        public int? IdUsuarioCreador { get; set; }
        public bool? Activo { get; set; }
    }
}
