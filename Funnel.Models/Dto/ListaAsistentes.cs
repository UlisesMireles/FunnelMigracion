using Funnel.Models.Base;
namespace Funnel.Models.Dto
{
    public class ListaAsistentes : BaseOut
    {
        public List<AsistentesDto>? Asistentes { get; set; }
    }
}
