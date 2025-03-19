using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Models.Dto;
using Funnel.Models.Base;
using Funnel.Data;

namespace Funnel.Logic.Interfaces
{
    public interface IArchivosService
    {
        public Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int IdEmpresa);
        public Task <BaseOut> DescargarArchivo(int idArchivo);
        public Task<BaseOut> GuardarArchivo(ArchivoDto request);
        public Task<BaseOut> EliminarArchivo(int idArchivo);
        public Task<BaseOut> RecuperarArchivo(int idArchivo);
        public Task<int> ObtenerNumeroArchivosSubidos(int IdEmpresa);
    }
}
