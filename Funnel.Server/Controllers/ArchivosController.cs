using Microsoft.AspNetCore.Mvc;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;


namespace Funnel.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController : Controller
    {
        private readonly IArchivosService _archivosService;
        public ArchivosController(IArchivosService archivosService)
        {
            _archivosService = archivosService;
        }

        [HttpGet("[action]/{idOportunidad}")]
        public async Task<ActionResult<List<ArchivoDto>>> ConsultarArchivo(int idOportunidad)
        {
            var result = await _archivosService.ConsultaArchivosPorOportunidad(idOportunidad);
            return Ok(result);
        }


        [HttpPost ("[action]")]
        public async Task<ActionResult<ArchivoDto>> GuardarArchivo([FromForm] InsertaArchivoDto request )
        {
            var result = await _archivosService.GuardarArchivo(request.Archivo, request);
            return Ok(result);
        }

        
        [HttpPost("[action]/{idArchivo}")]
        public async Task<ActionResult> EliminarArchivo(int idArchivo)
        {
            var result = await _archivosService.EliminarArchivo(idArchivo);
            return Ok(result);
        }

        [HttpPost("[action]/{idArchivo}")]
        public async Task<ActionResult> RecuperarArchivo(int idArchivo)
        {
            var result = await _archivosService.RecuperarArchivo(idArchivo);
            return Ok(result);
        }


        [HttpGet("descargaArchivo/{nombreArchivo}")]
            public async Task<IActionResult> DescargarArchivo(string nombreArchivo)
            {
                // Ruta relativa dentro del proyecto
                var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Archivos");

                // Combinar la ruta base con el nombre del archivo
                var filePath = Path.Combine(basePath, nombreArchivo);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("El archivo no existe.");
                }

                var memory = new MemoryStream();
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;

                // Obtener el tipo MIME del archivo
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(filePath, out var contentType))
                {
                    contentType = "application/octet-stream"; 
                }

                return File(memory, contentType, Path.GetFileName(filePath));
            }

    [HttpGet("[action]/{idOportunidad}")]
                public async Task<ActionResult<int>> ObtenerNumeroArchivosSubidos(int idOportunidad)
                {
                    var result = await _archivosService.ObtenerNumeroArchivosSubidos(idOportunidad);
                    return Ok(result);
                }
            }
        }