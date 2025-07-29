
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class EtiquetasOportunidadesDto : BaseOut
    {
        public List<EtiquetasOportunidadesDetalleDto> ProspectosNuevos { get; set; }
        public List<EtiquetasOportunidadesDetalleDto> AbiertasMes { get; set; }
        public List<EtiquetasOportunidadesDetalleDto> GanadasMes { get; set; }
        public List<EtiquetasOportunidadesDetalleDto> PerdidasMes { get; set; }
    }
    public class EtiquetasOportunidadesDetalleDto
    {
        public string? Prospecto { get; set; }
        public string? Oportunidad { get; set; }
        public string? Ejecutivo { get; set; }
        public string? InicialesEjecutivo { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }

    }
}
