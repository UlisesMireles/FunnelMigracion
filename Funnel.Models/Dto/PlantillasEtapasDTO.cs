using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class PlantillasEtapasDTO
    {
        public int IdPlantilla { get; set; }
        public string Plantilla { get; set; }
        public bool Estatus { get; set; }
        public string DesEstatus { get; set; }
        public int IdStage { get; set; }
        public string Orden { get; set; }
        public string NombreEtapa { get; set; }
        public string Probabilidad { get; set; }
    }
}
