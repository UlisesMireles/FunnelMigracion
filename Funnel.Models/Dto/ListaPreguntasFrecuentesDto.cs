using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class ListaPreguntasFrecuentesDto :  BaseOut
    {
        public List<PreguntasFrecuentesDto>? PreguntasFrecuentes { get; set; }
    }
}
