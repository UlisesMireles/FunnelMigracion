using Funnel.Models.Base;
using Funnel.Models.Dto;
namespace Funnel.Data.Interfaces
{
    public interface ILoginData
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
        public Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario);
        public Task<BaseOut> ObtenerVersion();
        public Task<UsuarioDto> ObtenerInformacionUsuario(string usuario);
        public Task<string> ObtenerInformacionNotificacionCorreo(string bandera, string usuario, string nombre, string apellidoPat, string apellidoMat);
    }
}
