using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class GuardarRegistroTemporalDto
    {
        public string Bandera { get; set; }  
        public int? IdRegistro { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Usuario { get; set; }
        public string? Password { get; set; }
        public string? RFC { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? Direccion { get; set; }
        public string? UrlSitio { get; set; }
        public string? Tamano { get; set; }
    }
}
