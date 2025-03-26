using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using System.Globalization;

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
            lista = oportunidades.GroupBy(x => x.FechaEstimadaCierre.HasValue ? x.FechaEstimadaCierre.Value.Month : 0).Select(x => new OportunidadesTarjetasDto
            {
                Nombre = x.First().FechaEstimadaCierre.HasValue ? x.First().FechaEstimadaCierre.Value.ToString("MMMM", cultura) : "Sin fecha",
                Mes = x.First().FechaEstimadaCierre.HasValue ? x.First().FechaEstimadaCierre.Value.Month : 0,
                Anio = x.First().FechaEstimadaCierre.Value.Year > 2000 ? x.First().FechaEstimadaCierre.Value.Year : 0,
                Tarjetas = x.Select(y => new TarjetasDto
                {
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
            }).ToList();

            lista = lista.Where(x => x.Nombre != "Sin fecha" && x.Anio > 0).OrderBy(x => x.Anio).ThenBy(x => x.Mes).ToList();
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
        public int[] ObtenerPrimerMes(List<OportunidadesEnProcesoDto> data)
        {
            int[] meses = new int[4];
            int[] anio = new int[4];
            string[] NombresMeses = new string[4];
            int primerMes = 0, primerAnio = 0;
            primerMes = data.OrderBy(x => x.FechaEstimadaCierre).Select(x => x.FechaEstimadaCierre.Value.Month).FirstOrDefault(DateTime.Now.Month);
            primerAnio = data.OrderBy(x => x.FechaEstimadaCierre).Select(x => x.FechaEstimadaCierre.Value.Year).FirstOrDefault(DateTime.Now.Year);

            for (int i = 0, j = primerMes; i < 4; i++, j++)
            {
                DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;
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
            return meses;
        }
    }
}
