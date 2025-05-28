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
using DinkToPdf.Contracts;
using Funnel.Logic.Utils;

namespace Funnel.Logic
{
    public class ContactoService : IContactoService
    {
        private readonly IContactoData _contactoData;
        private readonly ILoginService _loginService;
        private readonly IConverter _converter;
        public ContactoService(IContactoData contactoData, IConverter converter, ILoginService loginService)
        {
            _contactoData = contactoData;
            _converter = converter;
            _loginService = loginService;
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

        public async Task<byte[]> GenerarReporteContactos(ContactosReporteDTO contactos, string RutaBase, string titulo, int IdEmpresa)
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
