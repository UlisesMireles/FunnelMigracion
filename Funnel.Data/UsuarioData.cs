using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class UsuarioData : IUsuarioData
    {
        private readonly string _connectionString;

        public UsuarioData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<ComboTiposUsuariosDto>> ComboTiposUsuarios()
        {
            List<ComboTiposUsuariosDto> result = new List<ComboTiposUsuariosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-TIPOUSUARIO"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboTiposUsuariosDto();
                    dto.IdTipoUsuario = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]);
                    dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<UsuarioDto>> ConsultarUsuarios(int IdEmpresa)
        {
            List<UsuarioDto> result = new List<UsuarioDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new UsuarioDto
                    {
                        IdUsuario = ComprobarNulos.CheckIntNull(reader["IdUsuario"]),
                        Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]),
                        ApellidoPaterno = ComprobarNulos.CheckStringNull(reader["ApellidoPaterno"]),
                        ApellidoMaterno = ComprobarNulos.CheckStringNull(reader["ApellidoMaterno"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        IdTipoUsuario = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]),
                        Correo = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]),
                        Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]),
                        DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]),
                        TipoUsuario = ComprobarNulos.CheckStringNull(reader["TipoUsuario"]),
                        Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]),
                    };
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<UsuarioDto>> GuardarImagen(List<IFormFile> imagen, UsuarioDto request)
        {
            var archivosGuardados = new List<UsuarioDto>();
            var formatosPermitidos = new List<string> { ".jpg", ".png" };

            string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "ImagenPerfil");

            if (!Directory.Exists(carpetaDestino))
            {
                Directory.CreateDirectory(carpetaDestino);
            }

            foreach (var file in imagen)
            {
                var insertaImagen = new UsuarioDto();
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (formatosPermitidos.Contains(extension))
                {
                    var nombreArchivo = $"{request.ApellidoPaterno}_{request.ApellidoMaterno}_{request.Nombre}{extension}";
                    var rutaArchivo = Path.Combine(carpetaDestino, nombreArchivo);
                    using (var stream = new FileStream(rutaArchivo, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    request.ArchivoImagen = nombreArchivo;
                }
                else
                {
                    insertaImagen.ErrorMessage = $"Formato de archivo {extension} no permitido.";
                    insertaImagen.Result = false;
                    archivosGuardados.Add(insertaImagen);
                    continue;
                }

                try
                {
                    insertaImagen.Bandera = request.Bandera;
                    insertaImagen.Nombre = request.Nombre;
                    insertaImagen.ApellidoPaterno = request.ApellidoPaterno;
                    insertaImagen.ApellidoMaterno = request.ApellidoMaterno;
                    insertaImagen.Usuario = request.Usuario;
                    insertaImagen.Password = request.Password;
                    insertaImagen.Iniciales = request.Iniciales;
                    insertaImagen.Correo = request.Correo;
                    insertaImagen.IdTipoUsuario = request.IdTipoUsuario;
                    insertaImagen.IdUsuario = request.IdUsuario;
                    insertaImagen.IdEmpresa = request.IdEmpresa;
                    insertaImagen.Estatus = request.Estatus;
                    insertaImagen.ArchivoImagen = request.ArchivoImagen;

                    var resultado = await GuardarUsuarios(insertaImagen);
                

                    insertaImagen.Result = resultado.Result;
                    insertaImagen.ErrorMessage = resultado.ErrorMessage;

                }
                catch (Exception ex)
                {
                    insertaImagen.ErrorMessage = "Error al guardar el archivo: " + ex.Message;
                    insertaImagen.Result = false;
                    archivosGuardados.Add(insertaImagen);
                    continue;
                }

                archivosGuardados.Add(insertaImagen);
            }

            return archivosGuardados;

        }


        public async Task<BaseOut> GuardarUsuarios(UsuarioDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@ApellidoPaterno", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoPaterno ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@ApellidoMaterno", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoMaterno ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Usuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Usuario ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@Password", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, Encrypt.Encriptar(request.Password)),
                    DataBase.CreateParameterSql("@Iniciales", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Iniciales ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@CorreoElectronico", SqlDbType.VarChar, 300, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Correo ?? (object)DBNull.Value),
                    DataBase.CreateParameterSql("@IdTipoUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdTipoUsuario),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdUsuario),
                    DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Estatus),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdEmpresa ?? (object)DBNull.Value),

                };
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        if (request.Bandera == "INSERT")
                        {
                            result.Id = reader["IdUsuario"] != DBNull.Value ? Convert.ToInt32(reader["IdUsuario"]) : 0;
                            var imagenGuardada = await ActualizarFotoUsuario(result.Id, request.ArchivoImagen);
                        }
                    }
                }

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Usuario insertado correctamente.";
                        result.Result = true;
                        break;
                    case "UPDATE":
                        var imagenGuardada = await ActualizarFotoUsuario(result.Id, request.ArchivoImagen);
                        result.ErrorMessage = "Usuario actualizado correctamente.";
                        result.Id = request.IdUsuario;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Error al agregar usuario: " + ex.Message;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Error al actualizar usuario: " + ex.Message;
                        break;
                }
                result.Id = 0;
                result.Result = false;
            }
            return result;
        }

        public async Task<List<string>> ObtenerInicialesPorEmpresa(int idEmpresa)
        {
            List<string> iniciales = new List<string>();

            
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-INICIALES"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa)
            };

            
            using (IDataReader reader = await DataBase.GetReaderSql("F_Catalogos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    string inicial = ComprobarNulos.CheckStringNull(reader["Iniciales"]);
                    if (!string.IsNullOrEmpty(inicial))
                    {
                        iniciales.Add(inicial);
                    }
                }
            }

            return iniciales;
        }

        public async Task<bool> ValidarInicialesExistente(string iniciales, int idEmpresa)
        {

            var listaIniciales = await ObtenerInicialesPorEmpresa(idEmpresa);


            bool existenIniciales = listaIniciales.Contains(iniciales);

            return existenIniciales;
        }

        public async Task<BaseOut> ActualizarFotoUsuario(int id, string nombreArchivo)
            {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> parametros = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "UPDATE-FOTO"),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, id),
                    DataBase.CreateParameterSql("@NombreArchivo", SqlDbType.VarChar, 300, ParameterDirection.Input, false, null, DataRowVersion.Default, nombreArchivo)
                };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, parametros, _connectionString))
                {
                    while (reader.Read())
                    {
                    
                    }
                }

                result.Result = true;
                result.ErrorMessage = "Imagen actualizada correctamente.";
                result.Id = id;
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = "Error al actualizar la imagen: " + ex.Message;
            }

            return result;
        }

    }
}
