
using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class EtiquetasOportunidadesDto : BaseOut
    {
        public int? ProspectosNuevos { get; set; }
        public int? AbiertasMes { get; set; }
        public int? GanadasMes { get; set; }
        public int? PerdidasMes { get; set; }
    }
}
