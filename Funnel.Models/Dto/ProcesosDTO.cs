using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ProcesosDTO
    {
        public int IdProceso { get; set; }
        public int IdEmpresa { get; set; }
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public bool Estatus { get; set; }
        public int Oportunidades { get; set; }
        public int OportunidadesGanadas { get; set; }
        public int OportunidadesPerdidas { get; set; }
        public int OportunidadesEliminadas { get; set; }
        public int OportunidadesCanceladas { get; set; }
        public List<OportunidadesTarjetasDto>? Etapas { get; set; }
        public string DesEstatus { get; set; }
        public int IdPlantilla { get; set; }
    }
}
