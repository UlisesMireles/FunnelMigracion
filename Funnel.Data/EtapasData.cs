using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class EtapasData : IEtapasData
    {
        private readonly string _connectionString;
        public EtapasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<BaseOut> ModificacionesEtapa(OportunidadesTarjetasDto request, string bandera)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, bandera),
                    DataBase.CreateParameterSql("@pIdStage", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdStage),
                    DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre),
                    DataBase.CreateParameterSql("@pProbabilidad", SqlDbType.VarChar, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Probabilidad),
                    DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa)
                };

                using (var reader = await DataBase.GetReaderSql("F_CatalogoEtapas", CommandType.StoredProcedure, list, _connectionString))
                {
                }

                result.Result = true;
                result.ErrorMessage = "Etapa actualizada correctamente.";
            }
            catch (Exception ex)
            {
                result.ErrorMessage = $"Error al actualizar la etapa: {ex.Message}";
            }
            return result;
        }

    }
}
