using Azure.Core;
using DinkToPdf;
using DinkToPdf.Contracts;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic
{
    public class HerramientasService : IHerramientasService
    {
        private readonly IHerramientasData _herramientasData;
        private readonly IConverter _converter;
        private readonly ILoginService _loginService;


        public HerramientasService(IHerramientasData herramientasData, IConverter converter, ILoginService loginService)
        {
            _herramientasData = herramientasData;
            _converter = converter;
            _loginService = loginService;
        }

        public async Task<List<IngresosUsuariosDTO>> ConsultarIngresos(int IdUsuario, int IdEmpresa)
        {
            var ingresos = await _herramientasData.ConsultarIngresos(IdUsuario, IdEmpresa);

            var ingresosMensuales = ingresos
                .GroupBy(i => i.IdUsuario)
                .Select(i => new IngresosUsuariosDTO
                {
                    IdUsuario = i.Key,
                    Usuario = i.First().Usuario,
                    Total = i.Count(),
                    Anios = ingresos
                        .Where(v => v.IdUsuario == i.Key)
                        .GroupBy(v => v.FechaIngreso.Year)
                        .Select(v => v.Key)
                        .ToList(),

                    Ips = ingresos
                        .Where(v => v.IdUsuario == i.Key)
                        .Select(v => v.Ip)
                        .Where(ip => !string.IsNullOrEmpty(ip))
                        .Distinct()
                        .ToList(),

                    Ubicaciones = ingresos
                        .Where(v => v.IdUsuario == i.Key)
                        .Select(v => v.Ubicacion)
                        .Where(u => !string.IsNullOrEmpty(u))
                        .Distinct()
                        .ToList(),

                    Data = ingresos
                        .Where(v => v.IdUsuario == i.Key)
                        .GroupBy(i => new { i.Usuario, Anio = i.FechaIngreso.Year, Mes = i.FechaIngreso.Month })
                        .Select(g => new IngresosUsuariosPorMes
                        {
                            Usuario = g.Key.Usuario,
                            Anio = g.Key.Anio,
                            Mes = g.Key.Mes,
                            MesTexto = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Mes).ToUpper(),
                            TotalAccesos = g.Count(),
                            AccesosPorIp = g
                            .GroupBy(x => x.Ip)
                            .Where(x => !string.IsNullOrEmpty(x.Key))
                            .ToDictionary(
                                x => x.Key,
                                x => x.Count()
                            )
                        })
                        .OrderByDescending(x => x.Anio)
                        .ThenBy(x => x.Mes)
                        .ThenBy(x => x.Usuario)
                        .ToList()
                                })

                .OrderBy(i => i.Usuario)
                .ToList();

            return ingresosMensuales;
        }

        public async Task<byte[]> GenerarReporteIngresosUsuarios(IngresosFunnelReporteDTO ingresos, string RutaBase, string titulo, int IdEmpresa)
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

            var propiedadesTexto = typeof(IngresosFunnelDTO).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = ingresos.Datos.First().GetType().GetProperties();
            var keysColumnas = ingresos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = ingresos.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
            PropertyInfo propiedad;
            DateTime? fecha;

            // Generar tabla HTML dinámica
            var sb = new StringBuilder();
            sb.Append("<table>");
            sb.Append("" + "<thead><tr>");

            //Titulos Columnas
            foreach (var columna in nombresColumnas)
            {
                if (columna == "Fecha de Ingreso")
                    sb.Append("<th style=\"text-align: center;\">" + columna + "</th>");
                else
                    sb.Append("<th>" + columna + "</th>");
            }
            sb.Append("</tr></thead><tbody>");

            //Datos
            foreach (var item in ingresos.Datos)
            {
                sb.Append("<tr>");

                foreach (var columna in keysColumnas)
                {
                    propiedad = propiedades.First(v => v.Name.ToLower() == columna);
                    if (propiedad.PropertyType == typeof(DateTime?))
                    {
                        fecha = propiedad.GetValue(item) as DateTime?;
                        sb.Append($"<td style=\"text-align: center;\">{fecha?.ToString("dd-MM-yyyy hh:mm:ss tt")}</td>");
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

        public async Task<List<ComboCorreosUsuariosDTO>> ComboCorreosUsuariosActivos(int IdEmpresa)
        {
            return await _herramientasData.ComboCorreosUsuariosActivos(IdEmpresa);
        }

        public async Task<List<ComboCorreosUsuariosDTO>> ConsultarCorreosUsuariosReporteAuto(int IdEmpresa, int IdReporte)
        {
            return await _herramientasData.ConsultarCorreosUsuariosReporteAuto(IdEmpresa, IdReporte);
        }

        public async Task<List<EjecucionProcesosReportesDTO>> ConsultarEjecucionProcesosPorEmpresa(int IdEmpresa)
        {
            return await _herramientasData.ConsultarEjecucionProcesosPorEmpresa(IdEmpresa);
        }

        public async Task<BaseOut> EnvioCorreosReporteSeguimiento(int IdEmpresa, int IdReporte, List<string> Correos)
        {
            BaseOut result = new BaseOut();
            if (Correos.Count > 0)
            {
                string correos = String.Join(";", Correos);
                return await _herramientasData.EnvioCorreosReporteSeguimiento(IdEmpresa, IdReporte, correos);
            }
            result.ErrorMessage = "Error al enviar correos: No se selecciono ningun correo electrónico.";
            result.Result = false;
            return result;
        }

        public async Task<BaseOut> GuardarDiasReportesEstatus(EjecucionProcesosReportesDTO request)
        {
            string correos = "";
            if (request.Correos.Count > 0)
                correos = String.Join(";", request.Correos);
            return await _herramientasData.GuardarDiasReportesEstatus(request, correos);
        }
    }
}
