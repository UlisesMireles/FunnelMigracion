using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class ServiciosData : IServiciosData
    {
        private readonly string _connectionString;

        public ServiciosData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<ServicioDTO>> ConsultarServicios(int IdEmpresa)
        {
            List<ServicioDTO> result = new List<ServicioDTO>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoTiposOportunidades", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ServicioDTO
                    {
                        IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]),
                        Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                        Abreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                        FechaModificacion = ComprobarNulos.CheckDateTimeNull(reader["FechaModificacion"]),
                        Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]),
                        DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]),
                    };
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> CrearServicio(ServicioDTO request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "INSERT"),
                    DataBase.CreateParameterSql("@IdTipoProyecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdTipoProyecto),
                    DataBase.CreateParameterSql("@Descripcion", SqlDbType.VarChar, 255, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Descripcion ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Abreviatura", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Abreviatura ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@FechaRegistro", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.FechaRegistro ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@FechaModificacion", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.FechaModificacion ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Estatus ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa ?? (object)DBNull.Value)
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoServicios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read()) { }
                }

                result.ErrorMessage = "Servicio insertado correctamente.";
                result.Id = 1;
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al insertar servicio: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }
    }
}
