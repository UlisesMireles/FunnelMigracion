using DinkToPdf;
using DinkToPdf.Contracts;
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
    public class ProspectoService : IProspectosService
    {
        private readonly IProspectoData _ProspectoData;
        private readonly ILoginService _loginService;
        private readonly IConverter _converter;

        public ProspectoService(IProspectoData ProspectoData, IConverter converter, ILoginService loginService)
        {
            _ProspectoData = ProspectoData;
            _converter = converter;
            _loginService = loginService;
        }

        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            return await _ProspectoData.ComboSectores();
        }

        public async Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa)
        {
            var columnasAdicionales = await _ProspectoData.ColumnasAdicionales(IdEmpresa);
            var dataColumnasAdicionales = await _ProspectoData.ColumnasAdicionalesData(IdEmpresa, columnasAdicionales);

            var datosProspectos = await _ProspectoData.ConsultarProspectos(IdEmpresa);

            datosProspectos.ForEach(v => {
                var adicional = dataColumnasAdicionales.FirstOrDefault(x => x.IdProspecto == v.IdProspecto);
                v.PropiedadesAdicionales = adicional?.PropiedadesAdicionales ?? new Dictionary<string, string?>();
            });



            return datosProspectos;
        }

        public async Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa, string Anio)
        {
            return await _ProspectoData.ConsultarTopVeinte(IdEmpresa, Anio);
        }

        public async Task<BaseOut> GuardarProspecto(ProspectoDTO request)
        {
            BaseOut result = new BaseOut();
            //Validar que no exista registro con mismo nombre 
            var listaProspectos = await _ProspectoData.ConsultarProspectos((int)request.IdEmpresa);
            if(request.Bandera == "INSERT" && listaProspectos.FirstOrDefault(v => v.Nombre == request.Nombre) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            if (request.Bandera == "UPDATE" && listaProspectos.FirstOrDefault(v => v.Nombre == request.Nombre && v.IdProspecto != request.IdProspecto) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            return await _ProspectoData.GuardarProspecto(request);
        }

        public async Task<byte[]> GenerarReporteProspectos(ProspectosReporteDTO prospectos, string RutaBase, string titulo, int IdEmpresa)
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

            var propiedadesTexto = prospectos.Datos[0].Keys.Select(k => k.ToLower()).ToList();
            var keysColumnas = prospectos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key).ToList();
            var nombresColumnas = prospectos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
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
            foreach (var item in prospectos.Datos)
            {
                sb.Append("<tr>");

                foreach (var columna in keysColumnas)
                {
                    if (item.TryGetValue(columna, out var valorObj) && valorObj is DateTime fechaTmp)
                    {
                        sb.Append($"<td style=\"width: 100px;\">{fechaTmp.ToString("dd-MM-yyyy")}</td>");
                    }
                    else
                        sb.Append($"<td>{item[columna]}</td>");

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

        public async Task<byte[]> GenerarReporteTop20(ProspectosReporteDTO prospectos, string RutaBase, string titulo, int IdEmpresa)
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

            var propiedadesTexto = typeof(ProspectoDTO).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = prospectos.Datos.First().GetType().GetProperties();
            var keysColumnas = prospectos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = prospectos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
            var nombresColumnasColspan = nombresColumnas.Where(v => !v.Contains("%")).ToList();
            var nombresColumnasTotales = nombresColumnas.Where(v => v.Contains("%") || v.Contains("Total") && !v.Contains("Oportunidades Total")).ToList();
            PropertyInfo propiedad;
            DateTime? fecha;

            // Generar tabla HTML dinámica
            var sb = new StringBuilder();
            sb.Append("<table>");
            sb.Append("" + "<thead><tr>");

            //Titulos Columnas
            foreach (var columna in nombresColumnasColspan)
            {
                switch (columna)
                {
                    case "Total Ganadas":
                        sb.Append("<th colspan=\"2\" class=\"center\">Ganadas</th>");
                        break;
                    case "Total Perdidas":
                        sb.Append("<th colspan=\"2\" class=\"center\">Perdidas</th>");
                        break;
                    case "Total Canceladas":
                        sb.Append("<th colspan=\"2\" class=\"center\">Canceladas</th>");
                        break;
                    case "Total Eliminadas":
                        sb.Append("<th colspan=\"2\" class=\"center\">Eliminadas</th>");
                        break;
                    default:
                        sb.Append("<th rowspan=\"2\">" + columna + "</th>");
                        break;
                }
            }
            sb.Append("</tr><tr>");

            //Titulos Columnas
            foreach (var columna in nombresColumnasTotales)
            {
                sb.Append("<th>" + columna + "</th>");
            }
            sb.Append("</tr></thead><tbody>");

            //Datos
            foreach (var item in prospectos.Datos)
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

        public async Task<List<AniosDto>> ConsultarAniosOportunidades(int idEmpresa, int IdProceso)
        {
            return await _ProspectoData.ConsultarAniosOportunidades(idEmpresa, IdProceso);
        }

        public async Task<List<AniosDto>> ConsultarAniosGraficas(int idEmpresa)
        {
            return await _ProspectoData.ConsultarAniosGraficas(idEmpresa);
        }
    }
}
