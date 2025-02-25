using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface ILoginData
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
    }
}
