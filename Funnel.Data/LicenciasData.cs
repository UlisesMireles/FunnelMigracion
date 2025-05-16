using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;

namespace Funnel.Data
{
    public class LicenciasData : ILicenciasData
    {
        private readonly string _connectionString;
        public LicenciasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<LicenciasDto>> ConsultarLicencias()
        {
            List<LicenciasDto> result = new List<LicenciasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-LICENCIAS")
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoLicencias", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new LicenciasDto
                    {
                        IdLicencia = ComprobarNulos.CheckIntNull(reader["IdLicencia"]),
                        NombreLicencia = ComprobarNulos.CheckStringNull(reader["NombreLicencia"]),
                        CantidadUsuarios = ComprobarNulos.CheckIntNull(reader["CantidadUsuarios"]),
                        CantidadOportunidades = ComprobarNulos.CheckIntNull(reader["CantidadOportunidades"]),
                        Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]),
                    };
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
