using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class ArchivoService : IArchivosService
    {
        private readonly IArchivoData _ArchivoData;
        public ArchivoService(IArchivoData ArchivoData)
        {
            _ArchivoData = ArchivoData;
        }

        public async Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int idOportunidad)
        {
            return await _ArchivoData.ConsultaArchivosPorOportunidad(idOportunidad);
        }

        

        public async Task<BaseOut> EliminarArchivo(int idArchivo)
        {
            return await _ArchivoData.EliminarArchivo(idArchivo);
        }

        public async Task<ArchivoDto> GuardarArchivo(ArchivoDto request)
        {
            return await _ArchivoData.GuardarArchivo(request);
        }

        public async Task<List<ArchivoDto>> GuardarArchivos(List<IFormFile> archivos, ArchivoDto request)
        {
            return await _ArchivoData.GuardarArchivos(archivos, request);    
        }

        public async Task<int> ObtenerNumeroArchivosSubidos(int idOportunidad)
        {
            return await _ArchivoData.ObtenerNumeroArchivosSubidos(idOportunidad);
        }

        public async Task<BaseOut> RecuperarArchivo(int idArchivo)
        {
            return await _ArchivoData.RecuperarArchivo(idArchivo);
        }
    }
}