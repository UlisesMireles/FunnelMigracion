using Funnel.Models.Base;
using Funnel.Models.Dto;

namespace Funnel.Data.Interfaces
{
    public interface IArchivoData
    {
        public Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int idOportunidad);
        public Task <BaseOut> DescargarArchivo(int idArchivo);
        public Task<BaseOut> GuardarArchivo(ArchivoDto request);
        public Task<BaseOut> EliminarArchivo(int idArchivo);
        public Task<BaseOut> RecuperarArchivo(int idArchivo);
        public Task<int> ObtenerNumeroArchivosSubidos(int idOportunidad);
    }
}
