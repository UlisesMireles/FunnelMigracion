using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System.Globalization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Funnel.Logic
{
    public class OportunidadesEnProcesoService : IOportunidadesEnProcesoService
    {
        private readonly IOportunidadesEnProcesoData _oportunidadesData;
        public OportunidadesEnProcesoService(IOportunidadesEnProcesoData oportunidadesData)
        {
            _oportunidadesData = oportunidadesData;
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

            for(int i = 0; i < 4; i++)
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
                        FechaEstimadaCierre = y.FechaEstimadaCierre
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

            foreach(var item in etapas)
            {
                lista.Add(new OportunidadesTarjetasDto
                {
                    Nombre = item.Concepto ?? "Sin etapa",
                    Anio = item.Id,
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
                        FechaEstimadaCierre = y.FechaEstimadaCierre
                    }).ToList()
                });
            }
            

            lista = lista.Where(x => x.Nombre != "Sin etapa" && x.Anio > 0).OrderBy(x => x.Anio).ToList();
            return lista;
        }
        public async Task<BaseOut> ActualizarFechaEstimada(OportunidadesEnProcesoDto request)
        {
            return await _oportunidadesData.GuardarOportunidad(request);
        }
    }
}
