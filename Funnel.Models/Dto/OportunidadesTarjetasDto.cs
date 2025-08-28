using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class OportunidadesTarjetasDto
    {
        public string Nombre { get; set; } = string.Empty;
        public int? Mes { get; set; }
        public int? Anio { get; set; }
        public List<TarjetasDto>? Tarjetas { get; set; }
        public int? IdStage { get; set; }
        public bool? Eliminado { get; set; }
        public bool? Agregado { get; set; }
        public bool? Editado { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdEmpresa { get; set; }
        public string? Orden { get; set; }
        public string? Probabilidad { get; set; }
        public int RIdProcesoEtapa { get; set; }
    }

    public class TarjetasDto
    {
        public int? IdOportunidad { get; set; }
        public string NombreEmpresa { get; set; } = string.Empty;
        public string NombreAbrev { get; set; } = string.Empty;
        public string NombreOportunidad { get; set; } = string.Empty;
        public decimal? Monto { get; set; }
        public string? Probabilidad { get; set; }
        public decimal? MontoNormalizado { get; set; }
        public string Imagen { get; set; } = string.Empty;
        public string NombreEjecutivo { get; set; } = string.Empty;
        public string Iniciales { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public DateTime? FechaEstimadaCierre { get; set; }
        public int? IdTipoProyecto { get; set; }
        public string? NombreContacto { get; set; }
        public string? Entrega { get; set; }
        public DateTime? FechaEstimadaCierreOriginal { get; set; }
        public int? IdEstatusOportunidad { get; set; }
        public string? Comentario { get; set; }
        public int? IdProspecto { get; set; }
        public int? IdStage { get; set; }
        public int? IdTipoEntrega { get; set; }
        public int? IdEjecutivo { get; set; }
        public int? IdContactoProspecto { get; set; }
        public int? TotalComentarios { get; set; }
        public int? TotalArchivos { get; set; }
        public string? Stage { get; set; }
        public string? Nombre { get; set; }
        public string? TooltipStage { get; set; }
        public decimal? ScoreEstancamiento { get; set; }
    }
}
