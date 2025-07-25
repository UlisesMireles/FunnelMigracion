﻿using Azure.Core;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.SqlServer.Server;
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
                        FechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["FechaRegistro"]),
                        Eliminado = ComprobarNulos.CheckIntNull(reader["Eliminado"]),
                        NombreArchivo = ComprobarNulos.CheckStringNull(reader["NombreArchivo"]),
                        NombreArchivoFormateado = ComprobarNulos.CheckStringNull(reader["NombreArchivoFormateado"]),
                        NumArchivos = ComprobarNulos.CheckIntNull(reader["NumArchivos"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        DiasParaEliminacion = ComprobarNulos.CheckStringNull(reader["diasParaEliminacion"])

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
        public async Task<BaseOut> RecuperarArchivo(int idArchivo)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "RECOVER"),
                    DataBase.CreateParameterSql("@pIdArchivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idArchivo)
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
                {
                    result.ErrorMessage = "Archivo recuperado correctamente.";
                    result.Id = 0;
                    result.Result = true;
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al recuperar el archivo: " + ex.Message;
                result.Id = 1;
                result.Result = false;
            }
            return result;
        }

        public async Task<List<ArchivoDto>> GuardarArchivos(List<IFormFile> archivos, ArchivoDto request)
        {
            var archivosGuardados = new List<ArchivoDto>();
            var formatosPermitidos = new List<string> { "doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "rar", "zip" };

            string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "Archivos");

            if (!Directory.Exists(carpetaDestino))
            {
                Directory.CreateDirectory(carpetaDestino);
            }

            foreach (var archivo in archivos)
            {
                var insertaArchivo = new ArchivoDto();
                var extension = Path.GetExtension(archivo.FileName).TrimStart('.').ToLower();

                if (!formatosPermitidos.Contains(extension))
                {
                    insertaArchivo.ErrorMessage = $"Formato de archivo {extension} no permitido.";
                    insertaArchivo.Result = false;
                    archivosGuardados.Add(insertaArchivo);
                    continue;
                }

                string nombreArchivo = Path.GetFileNameWithoutExtension(archivo.FileName);
                string nombreArchivoBD = $"{nombreArchivo}^{request.IdEmpresa}_{request.IdProspecto}_{request.IdOportunidad}.{extension}";
                string rutaArchivo = Path.Combine(carpetaDestino, archivo.FileName);

                try
                {
                    using (var stream = new FileStream(rutaArchivo, FileMode.Create))
                    {
                        await archivo.CopyToAsync(stream);
                    }

                    insertaArchivo.Bandera = request.Bandera;
                    insertaArchivo.IdOportunidad = request.IdOportunidad;
                    insertaArchivo.IdUsuario = request.IdUsuario;
                    insertaArchivo.IdEmpresa = request.IdEmpresa;
                    insertaArchivo.IdProspecto = request.IdProspecto;
                    insertaArchivo.NombreArchivo = nombreArchivoBD;
                    insertaArchivo.Formato = extension;

                    insertaArchivo = await GuardarArchivo(insertaArchivo);

                    insertaArchivo.Result = true;
                }
                catch (Exception ex)
                {
                    insertaArchivo.ErrorMessage = "Error al guardar el archivo: " + ex.Message;
                    insertaArchivo.Result = false;
                }

                archivosGuardados.Add(insertaArchivo);
            }

            return archivosGuardados;
        }

        public async Task<ArchivoDto> GuardarArchivo(ArchivoDto request)
        {

            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
        {
            DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@pIdArchivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdArchivo),
            DataBase.CreateParameterSql("@pIdOportunidad", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdOportunidad),
            DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
            DataBase.CreateParameterSql("@pNombreArchivo", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreArchivo ?? (object)DBNull.Value)
        };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoArchivos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {

                    }
                }
                switch (request.Bandera)
                {
                    case "INSERT":
                        request.ErrorMessage = "Archivo insertado correctamente.";
                        request.Id = 1;
                        request.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        request.ErrorMessage = "Error al insertar archivo: " + ex.Message;
                        request.Id = 0;
                        request.Result = false;
                        break;
                }
            }
            return request;
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