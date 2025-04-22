using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Logic.Interfaces;
using Funnel.Models.Dto;
using Funnel.Data.Interfaces;
using Funnel.Models.Base;
using DinkToPdf;
using System.Reflection;

namespace Funnel.Logic
{
    public class ContactoService : IContactoService
    {
        private readonly IContactoData _contactoData;
        public ContactoService(IContactoData contactoData)
        {
            _contactoData = contactoData;
        }

        public async Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa)
        {
            return await _contactoData.ComboProspectos(IdEmpresa);
        }

        public async Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa)
        {
            return await _contactoData.ConsultarContacto(IdEmpresa);
        }

        public async Task<BaseOut> GuardarContacto(ContactoDto request)
        {
            BaseOut result = new BaseOut();
            //Validar que no exista registro con mismo nombre 
            var listaProspectos = await _contactoData.ConsultarContacto((int)request.IdEmpresa);

            var coincidencias = listaProspectos
                .Where(v => v.Nombre == request.Nombre )
                .ToList();

            if (request.Bandera == "INSERT" && coincidencias.Count >= 2)
            {
                result.ErrorMessage = "Error al guardar: Ya existen dos registros con ese nombre y apellido.";
                result.Result = false;
                return result;
            }

            return await _contactoData.GuardarContacto(request);
        }

        public async Task<HtmlToPdfDocument> GenerarReporteContactos(ContactosReporteDTO contactos, string RutaBase, string titulo)
        {
            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeader.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

            var propiedadesTexto = typeof(ContactoDto).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = contactos.Datos.First().GetType().GetProperties();
            var keysColumnas = contactos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = contactos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
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
            foreach (var item in contactos.Datos)
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
