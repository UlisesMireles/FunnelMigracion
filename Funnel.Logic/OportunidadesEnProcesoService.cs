using DinkToPdf;
using DinkToPdf.Contracts;
using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Logic.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Funnel.Logic
{
    public class OportunidadesEnProcesoService : IOportunidadesEnProcesoService
    {
        private readonly IOportunidadesEnProcesoData _oportunidadesData;
        private readonly ILoginService _loginService;
        private readonly IConverter _converter;
        public OportunidadesEnProcesoService(IOportunidadesEnProcesoData oportunidadesData, IConverter converter, ILoginService loginService)
        {
            _oportunidadesData = oportunidadesData;
            _converter = converter;
            _loginService = loginService;
        }

        public async Task<List<ContactoDto>> ComboContactos(int IdEmpresa, int IdProspecto)
        {
            return await _oportunidadesData.ComboContactos(IdEmpresa, IdProspecto);
        }

        public async Task<List<ComboEjecutivosDto>> ComboEjecutivos(int IdEmpresa)
        {
            return await _oportunidadesData.ComboEjecutivos(IdEmpresa);
        }

        public async Task<List<ComboEntregasDto>> ComboEntregas(int IdEmpresa)
        {
            return await _oportunidadesData.ComboEntregas(IdEmpresa);
        }

        public async Task<List<ComboEtapasDto>> ComboEtapas(int IdEmpresa)
        {
            return await _oportunidadesData.ComboEtapas(IdEmpresa);
        }

        public async Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa)
        {
            return await _oportunidadesData.ComboProspectos(IdEmpresa);
        }

        public async Task<List<ComboServiciosDto>> ComboServicios(int IdEmpresa)
        {
            return await _oportunidadesData.ComboServicios(IdEmpresa);
        }

        public async Task<List<ComboEstatusOportunidad>> ComboTipoOportunidad(int IdEmpresa)
        {
            return await _oportunidadesData.ComboTipoOportunidad(IdEmpresa);
        }

        public async Task<List<OportunidadesEnProcesoDto>> ConsultarHistoricoOportunidades(int IdEmpresa, int IdOportunidad)
        {
            return await _oportunidadesData.ConsultarHistoricoOportunidades(IdEmpresa, IdOportunidad);
        }

        public async Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus)
        {
            return await _oportunidadesData.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, IdEstatus);
        }

        public async Task<BaseOut> GuardarHistorico(OportunidadesEnProcesoDto request)
        {
            return await _oportunidadesData.GuardarHistorico(request);
        }

        public async Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            return await _oportunidadesData.GuardarOportunidad(request);
        }
        public async Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorMes(int IdUsuario, int IdEmpresa)
        {
            CultureInfo cultura = new CultureInfo("es-ES");

            List<OportunidadesTarjetasDto> lista = new List<OportunidadesTarjetasDto>();
            List<OportunidadesEnProcesoDto> oportunidades = await _oportunidadesData.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, 1);

            int[] meses = new int[4];
            int[] anio = new int[4];
            string[] NombresMeses = new string[4];
            int primerMes = 0, primerAnio = 0;
            primerMes = oportunidades.OrderBy(x => x.FechaEstimadaCierre).Select(x => x.FechaEstimadaCierre.Value.Month).FirstOrDefault(DateTime.Now.Month);
            primerAnio = oportunidades.OrderBy(x => x.FechaEstimadaCierre).Select(x => x.FechaEstimadaCierre.Value.Year).FirstOrDefault(DateTime.Now.Year);
            DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;
            for (int i = 0, j = primerMes; i < 4; i++, j++)
            {

                if (j > 12)
                {
                    meses[i] = j - 12;
                    string nombreMes = formatoFecha.GetMonthName(j - 12);
                    NombresMeses[i] = nombreMes;
                    anio[i] = primerAnio + 1;
                }
                else
                {
                    meses[i] = j;
                    string nombreMes = formatoFecha.GetMonthName(j);
                    NombresMeses[i] = nombreMes;
                    anio[i] = primerAnio;
                }
            }

            for (int i = 0; i < 4; i++)
            {
                lista.Add(new OportunidadesTarjetasDto
                {
                    Nombre = NombresMeses[i],
                    Anio = anio[i],
                    Mes = meses[i],
                    Tarjetas = oportunidades.Where(x => x.FechaEstimadaCierre.Value.Year == anio[i] && x.FechaEstimadaCierre.Value.Month == meses[i]).Select(y => new TarjetasDto
                    {
                        IdOportunidad = y.IdOportunidad,
                        NombreEmpresa = y.Nombre ?? "Sin nombre",
                        NombreAbrev = y.Abreviatura ?? "",
                        NombreOportunidad = y.NombreOportunidad ?? "",
                        Monto = y.Monto,
                        Probabilidad = y.Probabilidad,
                        MontoNormalizado = y.MontoNormalizado,
                        Imagen = y.Foto ?? "",
                        NombreEjecutivo = y.NombreEjecutivo ?? "",
                        Iniciales = y.Iniciales ?? "",
                        Descripcion = y.Descripcion ?? "",
                        FechaEstimadaCierre = y.FechaEstimadaCierre,
                        IdTipoProyecto = y.IdTipoProyecto,
                        NombreContacto = y.NombreContacto ?? "",
                        Entrega = y.Entrega,
                        FechaEstimadaCierreOriginal = y.FechaEstimadaCierreOriginal,
                        IdEstatusOportunidad = y.IdEstatusOportunidad,
                        Comentario = y.Comentario,
                        IdProspecto = y.IdProspecto,
                        IdStage = y.IdStage,
                        IdTipoEntrega = y.IdTipoEntrega,
                        IdEjecutivo = y.IdEjecutivo,
                        IdContactoProspecto = y.IdContactoProspecto,
                        TotalComentarios = y.TotalComentarios,
                        Stage = y.Stage,
                        Nombre = y.Nombre ?? "Sin nombre"



                    }).ToList()
                });
            }
            lista = lista.Where(x => x.Anio > 0).OrderBy(x => x.Anio).ThenBy(x => x.Mes).ToList();
            return lista;
        }
        public async Task<List<OportunidadesTarjetasDto>> ConsultarOportunidadesPorEtapa(int IdUsuario, int IdEmpresa)
        {
            CultureInfo cultura = new CultureInfo("es-ES");

            List<OportunidadesTarjetasDto> lista = new List<OportunidadesTarjetasDto>();
            List<ComboEtapasDto> etapas = await _oportunidadesData.ComboEtapas(IdEmpresa);
            List<OportunidadesEnProcesoDto> oportunidades = await _oportunidadesData.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, 1);

            foreach (var item in etapas)
            {
                lista.Add(new OportunidadesTarjetasDto
                {
                    Nombre = item.Concepto ?? "Sin etapa",
                    Anio = Convert.ToInt32(item.Stage),
                    Tarjetas = oportunidades.Where(x => x.IdStage == item.Id).Select(y => new TarjetasDto
                    {
                        IdOportunidad = y.IdOportunidad,
                        NombreEmpresa = y.Nombre ?? "Sin nombre",
                        NombreAbrev = y.Abreviatura ?? "",
                        NombreOportunidad = y.NombreOportunidad ?? "",
                        Monto = y.Monto,
                        Probabilidad = y.Probabilidad,
                        MontoNormalizado = y.MontoNormalizado,
                        Imagen = y.Foto ?? "",
                        NombreEjecutivo = y.NombreEjecutivo ?? "",
                        Iniciales = y.Iniciales ?? "",
                        Descripcion = y.Descripcion ?? "",
                        FechaEstimadaCierre = y.FechaEstimadaCierre,
                        IdTipoProyecto = y.IdTipoProyecto,
                        NombreContacto = y.NombreContacto ?? "",
                        Entrega = y.Entrega,
                        FechaEstimadaCierreOriginal = y.FechaEstimadaCierreOriginal,
                        IdEstatusOportunidad = y.IdEstatusOportunidad,
                        Comentario = y.Comentario,
                        IdProspecto = y.IdProspecto,
                        IdStage = y.IdStage,
                        IdTipoEntrega = y.IdTipoEntrega,
                        IdEjecutivo = y.IdEjecutivo,
                        IdContactoProspecto = y.IdContactoProspecto,
                        TotalComentarios = y.TotalComentarios

                    }).ToList()
                });
            }


            lista = lista.Where(x => x.Nombre != "Sin etapa" && x.Anio > 0).OrderBy(x => x.Anio).ToList();
            return lista;
        }
        public async Task<BaseOut> ActualizarFechaEstimada(OportunidadesEnProcesoDto request)
        {
            request.Bandera = "UPD-FECHAESTIMADA";
            return await _oportunidadesData.ActualizarFechaEstimada(request);
        }
        public async Task<BaseOut> ActualizarEtapa(OportunidadesEnProcesoDto request)
        {
            request.Bandera = "UPD-STAGE";
            return await _oportunidadesData.ActualizarEtapa(request);
        }

        public async Task<byte[]> GenerarReporteSeguimientoOportunidades(int IdEmpresa, int IdOportunidad, string RutaBase)
        {
            var imagenEmpresa = await _loginService.ObtenerImagenEmpresa(IdEmpresa);
            string urlLogo = $"{imagenEmpresa.UrlImagen}?v={Guid.NewGuid()}";
            string logoBase64 = await Descarga.DescargarImagenComoBase64(urlLogo);

            var datos = await _oportunidadesData.ConsultarHistoricoOportunidades(IdEmpresa, IdOportunidad);

            var rutaPlantillaHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnelHeaderDinamico.html");
            var rutaPlantillaBody = Path.Combine(RutaBase, "PlantillasReporteHtml", "PlantillaReporteFunnel.html");
            var htmlTemplateBody = System.IO.File.ReadAllText(rutaPlantillaBody);

            //Leer encabezado de plantilla de reporte
            string htmlTemplate = File.ReadAllText(rutaPlantillaHeader);
            string htmlHeaderDinamico = htmlTemplate.Replace("{{LogoBase64}}", logoBase64);
            htmlHeaderDinamico = htmlHeaderDinamico.Replace("{{Empresa}}", imagenEmpresa.NombreEmpresa);
            htmlHeaderDinamico = htmlHeaderDinamico.Replace("{{TITULO}}", "Reporte Seguimiento Oportunidades en Proceso");

            //Generar Html Temporal
            var rutaArchivoTempHeader = Path.Combine(RutaBase, "PlantillasReporteHtml", $"PlantillaReporteHeader-{Guid.NewGuid()}.html");
            File.WriteAllText(rutaArchivoTempHeader, htmlHeaderDinamico);

            // Generar tabla HTML dinámica
            var sb = new StringBuilder();
            sb.Append("<table>");
            sb.Append("" +
                "<thead>" +
                    "<tr>" +
                        "<th class='center'  style=\"width: 250px;\">Usuario</th>" +
                        "<th class='center' style=\"width: 100px;\">Fecha</th>" +
                        "<th class='center'>Comentario</th>" +
                   "</tr>" +
                "</thead>");
            sb.Append("<tbody>");
            foreach (var item in datos)
            {
                sb.Append("<tr>");
                sb.Append($"<td>{item.NombreEjecutivo}</td>");
                sb.Append($"<td class='center'>{item.FechaRegistro?.ToString("dd-MM-yyyy")}</td>");
                sb.Append($"<td class='justify'>{item.Comentario}</td>");
                sb.Append("</tr>");
            }
            sb.Append("</tbody></table>");

            // Reemplazar la tabla en la plantilla
            htmlTemplateBody = htmlTemplateBody.Replace("{{TABLA}}", sb.ToString());

            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait,
                    Margins = new MarginSettings { Top = 45 },
                    DocumentTitle = "Seguimiento Oportunidades",
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

        public async Task<byte[]> GenerarReporteOportunidades(OportunidadesReporteDto oportunidades, string RutaBase, string titulo, int IdEmpresa)
        {
            var imagenEmpresa = await _loginService.ObtenerImagenEmpresa(IdEmpresa);
            string urlLogo = $"{imagenEmpresa.UrlImagen}?v={Guid.NewGuid()}";
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

            var propiedadesTexto = typeof(OportunidadesEnProcesoDto).GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(v => v.Name.ToLower()).ToList();
            var propiedades = oportunidades.Datos.First().GetType().GetProperties();
            var keysColumnas = oportunidades.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.key.ToLower()).ToList();
            var nombresColumnas = oportunidades.Columnas.Where(v => propiedadesTexto.Contains(v.key.ToLower())).Select(v => v.valor).ToList();
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
            foreach (var item in oportunidades.Datos)
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
