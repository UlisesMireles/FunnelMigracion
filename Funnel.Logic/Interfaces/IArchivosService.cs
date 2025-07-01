using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Models.Base;
using Funnel.Data;
using Microsoft.AspNetCore.Http;

namespace Funnel.Logic.Interfaces
{
    public interface IArchivosService
    {
        public Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int IdEmpresa);
        public Task<ArchivoDto> GuardarArchivo(ArchivoDto request);

        public Task<List<ArchivoDto>> GuardarArchivos(List<IFormFile> archivos, ArchivoDto request);

        public Task<BaseOut> EliminarArchivo(int idArchivo);
        public Task<BaseOut> RecuperarArchivo(int idArchivo);
        public Task<int> ObtenerNumeroArchivosSubidos(int IdEmpresa);
    }
}
