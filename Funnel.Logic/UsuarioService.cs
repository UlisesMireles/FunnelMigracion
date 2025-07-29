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
using Funnel.Logic.Interfaces;
using Microsoft.AspNetCore.Http;
using DinkToPdf;
using System.Reflection;
using Funnel.Logic.Utils;
using DinkToPdf.Contracts;


namespace Funnel.Logic
{
    public class UsuarioService : IUsuariosService
    {
        private readonly IUsuarioData _usuarioData;
        private readonly ILoginService _loginService;
        private readonly IConverter _converter;

        public UsuarioService(IUsuarioData usuarioData, IConverter converter, ILoginService loginService)
        {
            _usuarioData = usuarioData;
            _converter = converter;
            _loginService = loginService;
        }
        public async Task<List<ComboTiposUsuariosDto>> ComboTiposUsuarios()
        {
            return await _usuarioData.ComboTiposUsuarios();
        }
        public async Task<List<ComboPuestosDto>> ComboPuestos()
        {
            return await _usuarioData.ComboPuestos();
        }
        public async Task<List<UsuarioDto>> ConsultarUsuarios(int IdUsuario)
        {
            return await _usuarioData.ConsultarUsuarios(IdUsuario);
        }

        public async Task<BaseOut> GuardarImagen(List<IFormFile> imagen, UsuarioDto request)
        {
            return await _usuarioData.GuardarImagen(imagen, request);
        }

        public async Task<BaseOut> GuardarUsuarios(UsuarioDto request)
        {
            BaseOut result = new BaseOut();
            return await _usuarioData.GuardarUsuarios(request);
        }

        public async Task<bool> ValidarInicialesExistente(string iniciales, int idEmpresa)
        {
            return await _usuarioData.ValidarInicialesExistente(iniciales, idEmpresa);
        }

        public async Task<byte[]> GenerarReporteUsuarios(UsuariosReporteDTO usuarios, string RutaBase, string titulo, int IdEmpresa)
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

            var propiedadesTexto = typeof(UsuarioDto).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = usuarios.Datos.First().GetType().GetProperties();
            var keysColumnas = usuarios.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = usuarios.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
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
            foreach (var item in usuarios.Datos)
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
                            Spacing = 1
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
