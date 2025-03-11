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
    public class TipoEntregaData : ITipoEntregaData
    {
        private readonly string _connectionString;

        public TipoEntregaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<TipoEntregaDto>> ConsultarTiposEntrega(int IdEmpresa)
        {
            List<TipoEntregaDto> result = new List<TipoEntregaDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoTiposEntrega", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new TipoEntregaDto
                    {
                        IdTipoEntrega = ComprobarNulos.CheckIntNull(reader["IdTipoEntrega"]),
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

        public async Task<BaseOut> GuardarTipoEntrega(TipoEntregaDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
        {
            DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pDescripcion", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Descripcion ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pAbreviatura", SqlDbType.VarChar, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Abreviatura ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pIdTipoEntrega", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdTipoEntrega ),
            DataBase.CreateParameterSql("@pEstatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Estatus ),
        };


                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoTiposEntrega", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Tipo de entrega insertado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Tipo de entrega correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                    default:
                        result.ErrorMessage = "Operación no válida.";
                        result.Id = 0;
                        result.Result = false;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Error al insertar el tipo de entrega: " + ex.Message;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Error al actualizar el tipo de entrega: " + ex.Message;
                        break;
                    default:
                        result.ErrorMessage = "Error desconocido: " + ex.Message;
                        break;
                }
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }


    }
}
