using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ServicioDTO
    {
        public int IdTipoProyecto { get; set; } 
        public string? Descripcion { get; set; } 
        public string? Abreviatura { get; set; }
        public DateTime? FechaRegistro { get; set; } 
        public DateTime? FechaModificacion { get; set; } 
        public int? Estatus { get; set; }
        public string? DesEstatus { get; set; }
        public int? IdEmpresa { get; set; } 
    }
}

