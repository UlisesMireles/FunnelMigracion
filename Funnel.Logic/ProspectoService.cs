using DinkToPdf;
using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
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
        public ProspectoService(IProspectoData ProspectoData)
        {
            _ProspectoData = ProspectoData;
        }

        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            return await _ProspectoData.ComboSectores();
        }

        public async Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa)
        {
            return await _ProspectoData.ConsultarProspectos(IdEmpresa);
        }

        public async Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa)
        {
            return await _ProspectoData.ConsultarTopVeinte(IdEmpresa);
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

        public async Task<HtmlToPdfDocument> GenerarReporteProspectos(ProspectosReporteDTO prospectos, string RutaBase, string titulo)
        {
            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeader.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

            var propiedadesTexto = typeof(ProspectoDTO).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = prospectos.Datos.First().GetType().GetProperties();
            var keysColumnas = prospectos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
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
                            HtmUrl = rutaPlantillaHeader,
                            Spacing = 5
                        }
                    }
                }
            };

            return doc;
        }

        public async Task<HtmlToPdfDocument> GenerarReporteTop20(ProspectosReporteDTO prospectos, string RutaBase, string titulo)
        {
            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeader.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

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
                            HtmUrl = rutaPlantillaHeader,
                            Spacing = 5
                        }
                    }
                }
            };

            return doc;
        }
    }
}
