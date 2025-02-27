using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
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

        public async Task<List<ServiciosDTO>> ConsultarServicios(int IdTipoServicio)
        {
            List<ServiciosDTO> result = new List<ServiciosDTO>();

            // Reemplazamos IdEmpresa por IdTipoServicio y eliminamos el parámetro Bandera.
            IList<ParameterSQl> list = new List<ParameterSQl>
    {
        DataBase.CreateParameterSql("@pIdTipoServicio", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdTipoServicio)
    };

            // Ejecutamos el procedimiento con el parámetro actualizado.
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoTiposOportunidades", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ServiciosDTO
                    {
                        IdTipoProyecto = ComprobarNulos.CheckIntNull(reader["IdTipoProyecto"]),
                        Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                        Abreviatura = ComprobarNulos.CheckStringNull(reader["Abreviatura"]),
                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        FechaModificacion = ComprobarNulos.CheckDateTimeNull(reader["FechaModificacion"]),
                        Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]),
                        IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"])
                    };
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
