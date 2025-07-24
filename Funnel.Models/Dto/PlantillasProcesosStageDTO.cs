using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class PlantillasProcesosStageDTO
    {
        public int IdPlantilla { get; set; }
        public string Plantilla { get; set; }
        public bool Estatus { get; set; }
        public string DesEstatus { get; set; }
        public List<OportunidadesTarjetasDto> Etapas { get; set; }
    }
}
