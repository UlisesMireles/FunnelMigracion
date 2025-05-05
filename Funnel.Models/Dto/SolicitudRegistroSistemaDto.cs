using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class SolicitudRegistroSistemaDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string Empresa { get; set; }
        public string? UrlSitio { get; set; }
        public string NoEmpleados { get; set; }
        public bool PrivacidadTerminos { get; set; }
        public string Recaptcha { get; set; }
    }
}
