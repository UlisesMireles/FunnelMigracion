using Azure.Core;
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
    public class ArchivoData : IArchivoData
    {
        private readonly string _connectionString;

        public ArchivoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<ArchivoDto>> ConsultaArchivosPorOportunidad(int idOportunidad)
        {
            List<ArchivoDto> result = new List<ArchivoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
    {
        DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
        DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idOportunidad)
    };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ArchivoDto
                    {
                        IdArchivo = ComprobarNulos.CheckIntNull(reader["IdArchivo"]),
                        IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                        IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]),
                        NombreArchivo = ComprobarNulos.CheckStringNull(reader["NombreArchivo"]),
                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        Eliminado = ComprobarNulos.CheckBooleanNull(reader["Eliminado"])
                    };
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<int> ObtenerNumeroArchivosSubidos(int idOportunidad)
        {
            int numArchivos = 0;
            IList<ParameterSQl> list = new List<ParameterSQl>
    {
        DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-NUM-ARCHIVOS"),
        DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idOportunidad)
    };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
            {
                if (reader.Read())
                {
                    numArchivos = ComprobarNulos.CheckIntNull(reader["NumArchivos"]);
                }
            }
            return numArchivos;
        }
        public async Task<List<ArchivoDto>> RecuperarArchivo(int idArchivo)
        {
            List<ArchivoDto> result = new List<ArchivoDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
    {
        DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "RECOVER"),
        DataBase.CreateParameterSql("@pIdArchivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idArchivo)
    };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ArchivoDto
                    {
                        IdArchivo = ComprobarNulos.CheckIntNull(reader["IdArchivo"]),
                        IdOportunidad = ComprobarNulos.CheckIntNull(reader["IdOportunidad"]),
                        IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]),
                        NombreArchivo = ComprobarNulos.CheckStringNull(reader["NombreArchivo"]),
                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        Eliminado = ComprobarNulos.CheckBooleanNull(reader["Eliminado"])
                    };
                    result.Add(dto);
                }
            }
            return result;
        }
        public async Task<BaseOut> GuardarArchivo(ArchivoDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
        {
            DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pIdArchivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdArchivo),
            DataBase.CreateParameterSql("@IdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdOportunidad),
            DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
            DataBase.CreateParameterSql("@NombreArchivo", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreArchivo ?? (object)DBNull.Value)
        };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
                {
                    if (reader.Read())
                    {
                        result.Id = ComprobarNulos.CheckIntNull(reader["IdArchivo"]);
                        result.ErrorMessage = request.Bandera == "INSERT" ? "Archivo insertado correctamente." : "Archivo actualizado correctamente.";
                        result.Result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = request.Bandera == "INSERT" ? "Error al insertar archivo: " + ex.Message : "Error al actualizar archivo: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }
        public async Task<BaseOut> EliminarArchivo(int idArchivo)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
        {
            DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "DELETE"),
            DataBase.CreateParameterSql("@pIdArchivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idArchivo)
        };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
                {
                    result.ErrorMessage = "Archivo eliminado correctamente.";
                    result.Id = 1;
                    result.Result = true;
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al eliminar archivo: " + ex.Message;
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }
    }
}