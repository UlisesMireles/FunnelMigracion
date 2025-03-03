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

        public async Task<List<ComboProspectosDto>> ComboProspectos(int IdEmpresa)
        {
            List<ComboProspectosDto> result = new List<ComboProspectosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "PROSPECTOS"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboProspectosDto();
                    dto.Id = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ContactoDto>> ConsultarContacto(int IdEmpresa)
        {
            List<ContactoDto> result = new List<ContactoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
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

        public async Task<BaseOut> GuardarContacto(ContactoDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Apellidos", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Apellidos ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Telefono", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Telefono ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Correo", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.CorreoElectronico ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@IdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdProspecto),
                    DataBase.CreateParameterSql("@IdContactoProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdContactoProspecto),
                    DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Estatus),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa)
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoContactosProspectos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }

                }   
                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Contacto insertado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Contacto actualizado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }
            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Error al insertar prospecto: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Error al actualizar prospecto: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }
            }
            return result;
        }
    }
}
