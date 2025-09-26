using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class ListaPreguntasFrecuentesCategoriaDto : BaseOut
    {
        public List<AsitenteCategoriasDto>? Asistentes { get; set; }
    }
}
