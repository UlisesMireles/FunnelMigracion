using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data.Interfaces
{
    public interface IConfiguracionesData
    {
       // public Task<ListaConfiguracionesDto> Configuraciones();
        public Task<ConfiguracionDto> ConfiguracionPorIdBot(int idBot);
      //  public Task<InsertaModificaConfiguracionDto> InsertaConfiguracion(InsertaModificaConfiguracionDto insert);
      //  public Task<InsertaModificaConfiguracionDto> ModificaConfiguracion(InsertaModificaConfiguracionDto update);
      //  public Task<ValidaApiKeyDto> ValidaApiKey(ValidaApiKeyDto validaApiKey);
    }
}
