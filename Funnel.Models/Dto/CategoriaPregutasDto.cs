namespace Funnel.Models.Dto
{
    public class CategoriaPregutasDto : CategoriasDto
    {
        public List<PreguntasPorCategoriaDto>? ListaPreguntasPorCategoria { get; set; }
    }
}
