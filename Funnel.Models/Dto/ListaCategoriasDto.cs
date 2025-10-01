using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class ListaCategoriasDto : BaseOut
    {
        public List<CategoriasDto>? Categorias { get; set; }
    }
}
