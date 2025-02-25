using Funnel.Models.Dto;
namespace Funnel.Logic.Interfaces
{
    public interface ILoginService
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
    }
}
