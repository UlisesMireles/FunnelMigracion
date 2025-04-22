using Funnel.Data;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using Azure.Core;
using DinkToPdf;
using System.Reflection;

namespace Funnel.Logic
{
    public class ServiciosService : IServiciosService  
    {
        private readonly IServiciosData _serviciosData;  

        public ServiciosService(IServiciosData serviciosData)  
        {
            _serviciosData = serviciosData;
        }

        public async Task<List<ServicioDTO>> ConsultarServicios(int IdTipoProyecto)
        {
            return await _serviciosData.ConsultarServicios(IdTipoProyecto);
        }

        public async Task<BaseOut> GuardarServicio(ServicioDTO request)
        {
            BaseOut result = new BaseOut();
            var listaServicios = await _serviciosData.ConsultarServicios((int)request.IdEmpresa);
            if (request.Bandera == "INSERT" && listaServicios.FirstOrDefault(v => v.Descripcion == request.Descripcion) != null)
            {
                result.ErrorMessage = "Error al guardar: Ya existe un registro con ese nombre.";
                result.Result = false;
                return result;
            }
            return await _serviciosData.GuardarServicio(request);
        }

        public async Task<HtmlToPdfDocument> GenerarReporteServicios(ServiciosReporteDTO servicios, string RutaBase, string titulo)
        {
            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeader.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

            var propiedadesTexto = typeof(ServicioDTO).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = servicios.Datos.First().GetType().GetProperties();
            var keysColumnas = servicios.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = servicios.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
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
            foreach (var item in servicios.Datos)
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
