using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class ListaPreguntasPorCategoriaDto : BaseOut
    {
        public List<CategoriaPregutasDto>? PreguntasPorCategoria { get; set; }
    }
}
