using DinkToPdf.Contracts;
using DinkToPdf;
using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class ProcesosService : IProcesosService
    {
        private readonly IProcesosData _procesosData;
        private readonly IConverter _converter;
        private readonly ILoginService _loginService;

        public ProcesosService(IProcesosData ProcesosData, IConverter converter, ILoginService loginService)
        {
            _procesosData = ProcesosData;
            _converter = converter;
            _loginService = loginService;
        }

        public async Task<List<PlantillasProcesosStageDTO>> ConsultarPlantillasProcesosEtapas()
        {
            var data = await _procesosData.ConsultarPlantillasProcesosEtapas();

            //Obtener plantillas
            var plantillas = data.GroupBy(v => v.IdPlantilla).
                Select(v =>
                    new PlantillasProcesosStageDTO
                    {
                        IdPlantilla = v.Key,
                        Plantilla = v.First().Plantilla,
                        Estatus = v.First().Estatus,
                        DesEstatus = v.First().DesEstatus
                    }).ToList();

            //Obtener Etapas
            plantillas.ForEach(v =>
            {
                v.Etapas = data.Where(x => x.IdPlantilla == v.IdPlantilla)
                .Select(y =>
                    new OportunidadesTarjetasDto
                    {
                        IdStage = y.IdStage,
                        Nombre = y.NombreEtapa,
                        Orden = y.Orden,
                        Probabilidad = y.Probabilidad
                    }).ToList();
            });

            return plantillas;
        }

        public async Task<ProcesosDTO> ConsultarEtapasPorProceso(int IdProceso)
        {
            return await _procesosData.ConsultarEtapasPorProceso(IdProceso);
        }

        public async Task<List<ProcesosDTO>> ConsultarProcesos(int IdEmpresa)
        {
            return await _procesosData.ConsultarProcesos(IdEmpresa);
        }

        public async Task<List<OportunidadesTarjetasDto>> InsertarModificarEtapa(List<OportunidadesTarjetasDto> etapas)
        {
            BaseOut guardado;

            foreach (OportunidadesTarjetasDto item in etapas)
            {
                if (item.Agregado is not null && item.Agregado == true && item.Eliminado == false && item.IdStage == 0)
                {
                    guardado = await _procesosData.InsertarModificarEtapa(item, "INSERTAR-ETAPA");
                    item.IdStage = guardado.Id;
                }
                else if (item.Editado is not null && item.Editado == true && item.Eliminado == false && item.IdStage > 0)
                {
                    guardado = await _procesosData.InsertarModificarEtapa(item, "UPDATE-ETAPA");
                    item.IdStage = guardado.Id;
                }
            }
            return etapas;
        }

        public async Task<BaseOut> InsertarModificarProcesoEtapa(ProcesosDTO request)
        {
            BaseOut result = new BaseOut();
            if (request.Etapas.Count < 3 || request.Etapas.Count > 7)
            {
                result.ErrorMessage = "Error al guardar proceso: Deben seleccionarse minímo 3 etapas o máximo 7 etapas.";
                result.Result = false;
                return result;
            }

            //Insertar o actulizar Etapas
            request.Etapas = await InsertarModificarEtapa(request.Etapas);

            //Insertar o actualizar datos de Proceso, y etapas eliminadas del proceso
            return await _procesosData.InsertarModificarProcesoEtapa(request);


        }

        public async Task<byte[]> GenerarReporteProcesos(ProcesosReportesDTO procesos, string RutaBase, string titulo, int IdEmpresa)
        {
            var imagenEmpresa = await _loginService.ObtenerImagenEmpresa(IdEmpresa);
            string urlLogo = imagenEmpresa.UrlImagen;
            string logoBase64 = await Descarga.DescargarImagenComoBase64(urlLogo);

            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeaderDinamico.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

            //Leer encabezado de plantilla de reporte
            string htmlTemplate = File.ReadAllText(rutaPlantillaHeader);
            string htmlHeaderDinamico = htmlTemplate.Replace("{{LogoBase64}}", logoBase64);
            htmlHeaderDinamico = htmlHeaderDinamico.Replace("{{Empresa}}", imagenEmpresa.NombreEmpresa);
            htmlHeaderDinamico = htmlHeaderDinamico.Replace("{{TITULO}}", titulo);

            //Generar Html Temporal
            var rutaArchivoTempHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", $"PlantillaReporteHeader-{Guid.NewGuid()}.html");
            File.WriteAllText(rutaArchivoTempHeader, htmlHeaderDinamico);

            var propiedadesTexto = typeof(ProcesosDTO).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = procesos.Datos.First().GetType().GetProperties();
            var keysColumnas = procesos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = procesos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
            PropertyInfo propiedad;
            DateTime? fecha;

            // Generar tabla HTML dinámica
            var sb = new StringBuilder();
            sb.Append("<table>");
            sb.Append("" + "<thead><tr>");

            //Titulos Columnas
            foreach (var columna in nombresColumnas)
            {
                sb.Append("<th>" + columna + "</th>");
            }
            sb.Append("</tr></thead><tbody>");

            //Datos
            foreach (var item in procesos.Datos)
            {
                sb.Append("<tr>");

                foreach (var columna in keysColumnas)
                {
                    propiedad = propiedades.First(v => v.Name.ToLower() == columna);
                    if (propiedad.PropertyType == typeof(DateTime?))
                    {
                        fecha = propiedad.GetValue(item) as DateTime?;
                        sb.Append($"<td style=\"width: 100px;\">{fecha?.ToString("dd-MM-yyyy")}</td>");
                    }
                    else
                        sb.Append($"<td>{propiedad.GetValue(item)}</td>");

                }
                sb.Append("</tr>");
            }
            sb.Append("</tbody></table>");

            // Reemplazar la tabla en la plantilla
            htmlTemplateBody = htmlTemplateBody.Replace("{{TITULO}}", titulo);
            htmlTemplateBody = htmlTemplateBody.Replace("{{TABLA}}", sb.ToString());

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    PaperSize = PaperKind.Legal,
                    Orientation = Orientation.Landscape,
                    Margins = new MarginSettings { Top = 45 },
                    DocumentTitle = titulo,
                },
                Objects = {
                    new ObjectSettings() {
                        PagesCount = true,
                        HtmlContent = htmlTemplateBody,
                        WebSettings = { DefaultEncoding = "utf-8" },
                        HeaderSettings = new HeaderSettings
                        {
                            HtmUrl = rutaArchivoTempHeader,
                            Spacing = 5
                        }
                    }
                }
            };

            //Convertir PDF
            byte[] pdfBytes = _converter.Convert(doc);

            //Eliminar el archivo temporal
            if (File.Exists(rutaArchivoTempHeader))
                File.Delete(rutaArchivoTempHeader);


            return pdfBytes;
        }
    }
}
