using Funnel.Models.Base;
using Funnel.Models.Dto;
namespace Funnel.Logic.Interfaces
{
    public interface ILoginService
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
        public Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario);
        public Task<BaseOut> ObtenerVersion();
    }
}
