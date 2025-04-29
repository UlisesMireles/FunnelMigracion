using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ProspectoDTO
    {
        public string? Bandera { get; set; }
        public int IdProspecto { get; set; }
        public string? Nombre { get; set; }
        public string? UbicacionFisica { get; set; }
        public int Estatus { get; set; }
        public string? DesEstatus { get; set; }
        public string? NombreSector { get; set; }
        public int? IdSector { get; set; }
        public int? TotalOportunidades { get; set; }
        public int? Proceso { get; set; }
        public int? Ganadas { get; set; }
        public int? Perdidas { get; set; }
        public int? Canceladas { get; set; }
        public int? Eliminadas { get; set; }
        public int? IdEmpresa  { get; set; }
        public decimal PorcGanadas { get; set; }
        public decimal PorcPerdidas { get; set; }
        public decimal PorcCanceladas { get; set; }
        public decimal PorcEliminadas { get; set; }

        public decimal PorcEfectividad { get; set; }
    }
}
