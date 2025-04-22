using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;

namespace Funnel.Data.Interfaces
{
    public interface IArchivoData
    {
        public Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int idOportunidad);

        public Task<ArchivoDto> GuardarArchivo(ArchivoDto request);

        public  Task<List<ArchivoDto>> GuardarArchivos(List<IFormFile> archivos, ArchivoDto request);

        public Task<BaseOut> EliminarArchivo(int idArchivo);
        public Task<BaseOut> RecuperarArchivo(int idArchivo);
        public Task<int> ObtenerNumeroArchivosSubidos(int idOportunidad);
    }
}
