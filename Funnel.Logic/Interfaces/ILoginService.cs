using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
namespace Funnel.Logic.Interfaces
{
    public interface ILoginService
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
        public Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario);
        public Task<BaseOut> ObtenerVersion();
        public Task<BaseOut> ResetPassword(string usuario);
        public Task<BaseOut> GuardarSolicitudRegistro(SolicitudRegistroSistemaDto datos);
        public Task<BaseOut> CambioPassword(UsuarioDto datos);

        public Task<BaseOut> ReenviarCodigo(string correo);

        public Task<BaseOut> GuardarImagen(int idUsuario, IFormFile imagen, UsuarioDto request);
        public Task<BaseOut> RegistrarIngresoUsuario(string Bandera, int IdUsuario, int IdEmpresa, string SesionId, string MotivoCierre);
        public Task<EmpresaDTO> ObtenerImagenEmpresa(int IdEmpresa);
        public Task<UsuarioDto> ObtenerPermitirDecimales(int idEmpresa);
    }
}
