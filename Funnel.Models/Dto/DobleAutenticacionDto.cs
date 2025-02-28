using Funnel.Models.Base;

namespace Funnel.Models.Dto
{
    public class DobleAutenticacionDto : BaseOut
    {
        public int Codigo { get; set; }
        public int TipoMensaje { get; set; }
    }
    public class CodigoDosPasosDto
    {
        public string? Usuario { get; set; }
        public int Codigo { get; set; }
    }
}
