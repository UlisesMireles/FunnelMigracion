

using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class GraficaDto : BaseOut
    {
        public int Id { get; set; }
        public string? Label { get; set; }
        public decimal Monto { get; set; }
        public decimal MontoNormalizado { get; set; }
        public decimal Valor { get; set; }
        public decimal Porcentaje { get; set; }
        public string? ColoreSerie { get; set; }
        public int Contador { get; set; }
        public int Area { get; set; }
    }
    public class RequestGrafica
    {
        public int IdEmpresa { get; set; }
        public string? Bandera { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdEstatusOportunidad { get; set; }
        public int? Anio { get; set; }
    }
    public class AgenteDto
    {
        public int IdAgente { get; set; }
        public string? Nombre { get; set; }
        public decimal? TotalAgente { get; set; }
        public decimal? MontoNormalizado { get; set; }
        public string? ArchivoImagen { get; set; }

    }
    public class AniosDto
    {
        public int IdEmpresa { get; set; }
        public int? IdEstatusOportunidad { get; set; }
        public int? Anio { get; set; }
    }
        public class SectorDto
        {
            public int IdSector { get; set; }
            public string? NombreSector { get; set; }
            public decimal Monto { get; set; }
            public decimal MontoNormalizado { get; set; }
        }
        public class OportunidadSectorDto
        {
            public int IdOportunidad { get; set; }
            public string? NombreProspecto { get; set; }
            public string? NombreOportunidad { get; set; }
            public string? TipoProyecto { get; set; }
            public string? Ejecutivo { get; set; }
            public decimal Monto { get; set; }
            public string? FechaEstimadaCierre { get; set; }
            public decimal? MontoNormalizado { get; set; }
            public string? Probabilidad { get; set; }
            public string? Stage { get; set; }
            public string? TipoProyectoAbreviatura { get; set; }
            public string? Iniciales { get; set; }
        }
        public class TipoProyectoDto
        {
            public int IdTipoProyecto { get; set; }
            public string? Descripcion { get; set; }
            public decimal Monto { get; set; }
            public decimal MontoNormalizado { get; set; }
            public decimal Porcentaje { get; set; }
        }
        public class OportunidadTipoDto
        {
            public int IdOportunidad { get; set; }
            public string? NombreProspecto { get; set; }
            public string? NombreOportunidad { get; set; }
            public string? TipoProyecto { get; set; }
            public string? Ejecutivo { get; set; }
            public decimal Monto { get; set; }
            public string? FechaEstimadaCierre { get; set; }
            public decimal? MontoNormalizado { get; set; }
            public string? Probabilidad { get; set; }
            public string? Stage { get; set; }
            public string? TipoProyectoAbreviatura { get; set; }
            public string? Iniciales { get; set; }
        }
}
