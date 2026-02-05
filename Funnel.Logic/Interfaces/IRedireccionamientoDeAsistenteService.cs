using Funnel.Models.Dto;
namespace Funnel.Logic.Interfaces
{
    public interface IRedireccionamientoDeAsistenteService
    {
        public Task<ConsultaAsistente> AsignacionDeAsistente(ConsultaAsistente data);
    }
}
