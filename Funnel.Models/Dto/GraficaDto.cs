

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
    }

}