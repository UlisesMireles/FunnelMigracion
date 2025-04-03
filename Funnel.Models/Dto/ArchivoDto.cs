using Funnel.Models.Base;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class ArchivoDto : BaseOut
    {
        public string? Bandera { get; set; }
        public int IdArchivo { get; set; }
        public string? NombreArchivo { get; set; }
        public string? NombreArchivoFormateado { get; set; }
        public int IdOportunidad { get; set; }
        public int IdUsuario { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int? NumArchivos { get; set; }
        public int Eliminado { get; set; }
        public string? Iniciales { get; set; }
        public string? NombreArchivoCargado { get; set; }
        public int? IdEmpresa { get; set; }
        public int? IdProspecto { get; set; }
        public string? Formato { get; set; }
    }
}
