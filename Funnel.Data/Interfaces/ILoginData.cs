using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
namespace Funnel.Data.Interfaces
{
    public interface ILoginData
    {
        public Task<UsuarioDto> Autenticar(string user, string contrasena);
        public Task<DobleAutenticacionDto> VerificarCodigoDobleAutenticacion(CodigoDosPasosDto usuario);
        public Task<BaseOut> ObtenerVersion();
        public Task<UsuarioDto> ObtenerInformacionUsuario(string usuario);
        public Task<string> ObtenerInformacionNotificacionCorreo(string bandera, string usuario, string nombre, string apellidoPat, string apellidoMat);
        public Task<UsuarioDto> AdministradorEmpresas();
        public Task<BaseOut> SolicitudesUsuarios(SolicitudRegistroSistemaDto datos);

        public Task<BaseOut> ReenviarCodigo(string correo);

        public Task<BaseOut> GuardarImagen(int idUsuario, IFormFile imagen, UsuarioDto request);
        public Task<BaseOut> CambioPassword(string bandera, string Nombre, string ApellidoPaterno, string ApellidoMaterno,
            string Usuario, string Inicales, string CorreoElectronico, int IdTipoUsuario, int IdUsuario, int Estatus, string password, int idEmpresa);
        public Task<BaseOut> RegistrarIngresoUsuario(string Bandera, int IdUsuario, int IdEmpresa, string SesionId, string MotivoCierre);
        public Task<EmpresaDTO> ObtenerImagenEmpresa(int IdEmpresa);
        public Task<UsuarioDto> ObtenerPermitirDecimales(int idEmpresa);

    }
}
