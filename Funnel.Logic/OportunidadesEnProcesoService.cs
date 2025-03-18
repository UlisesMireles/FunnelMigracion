using Funnel.Data;
using Funnel.Data.Interfaces;
using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;

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

        public async Task<List<OportunidadesEnProcesoDto>> ConsultarOportunidadesEnProceso(int IdUsuario, int IdEmpresa, int IdEstatus)
        {
            return await _oportunidadesData.ConsultarOportunidadesEnProceso(IdUsuario, IdEmpresa, IdEstatus);
        }

        public async Task<BaseOut> GuardarOportunidad(OportunidadesEnProcesoDto request)
        {
            return await _oportunidadesData.GuardarOportunidad(request);
        }
    }
}
