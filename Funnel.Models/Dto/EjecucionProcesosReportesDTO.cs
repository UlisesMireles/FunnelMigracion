using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class EjecucionProcesosReportesDTO
    {
        public string? Bandera { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdEmpresa { get; set; }
        public int IdReporte { get; set; }
        public string Nombre { get; set; }
        public TimeSpan HoraEjecucion { get; set; }
        public int Frecuencia { get; set; }
        public int DiasInactividad { get; set; }
        public int DiasFechaVencida { get; set; }
        public bool EjecucionJob { get; set; }
    }
}
