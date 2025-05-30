using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class EmpresaDTO
    {
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public string UrlImagen { get; set; }
        public bool? Result { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
