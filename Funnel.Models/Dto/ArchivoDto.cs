using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ArchivoDto
    {
        public string? Bandera { get; set; }
        public int IdArchivo { get; set; }
        public string NombreArchivo { get; set; }
        public int IdOportunidad { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int? NumArchivos { get; set; }
        public bool Eliminado { get; set; }
    }
}
