using Microsoft.Extensions.Configuration;
using Funnel.Models.Base;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using System.Data;
using Funnel.Models.Dto;

namespace Funnel.Data
{
    public class ContactoData : IContactoData
    {
        private readonly string _connectionString;
        public ContactoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<ContactoDto>> ConsultarContacto(int idEmpresa)
        {
            List<ContactoDto> result = new List<ContactoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoContactosProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ContactoDto();
                    dto.IdContactoProspecto = ComprobarNulos.CheckIntNull(reader["IdContactoProspecto"]);
                    dto.NombreCompleto = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.Apellidos = ComprobarNulos.CheckStringNull(reader["Apellidos"]);
                    dto.Telefono = ComprobarNulos.CheckStringNull(reader["Telefono"]);
                    dto.CorreoElectronico = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]);
                    dto.Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]);
                    dto.DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]);
                    dto.Prospecto = ComprobarNulos.CheckStringNull(reader["Prospecto"]);
                    dto.IdProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                 
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
