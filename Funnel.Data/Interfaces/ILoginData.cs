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
        public Task<UsuarioDto> AdministradorEmpresas();
        public Task<BaseOut> SolicitudesUsuarios(SolicitudRegistroSistemaDto datos);
        public Task<BaseOut> GuardarImagen(int idUsuario, string nombreArchivo);
        public Task<BaseOut> CambioPassword(string bandera, string Nombre, string ApellidoPaterno, string ApellidoMaterno,
            string Usuario, string Inicales, string CorreoElectronico, int IdTipoUsuario, int IdUsuario, int Estatus, string password, int idEmpresa);
        public Task<BaseOut> RegistrarIngresoUsuario(int IdUsuario, int IdEmpresa);

    }
}
