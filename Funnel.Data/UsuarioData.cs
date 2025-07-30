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
        public async Task<List<ComboPuestosDto>> ComboPuestos()
        {
            List<ComboPuestosDto> result = new List<ComboPuestosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-PUESTO"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboPuestosDto();
                    dto.IdPuesto = ComprobarNulos.CheckIntNull(reader["IdPuesto"]);
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
                        Nombre = ComprobarNulos.CheckStringNull(reader["NombreCompleto"]),
                        ApellidoPaterno = ComprobarNulos.CheckStringNull(reader["ApellidoPaterno"]),
                        ApellidoMaterno = ComprobarNulos.CheckStringNull(reader["ApellidoMaterno"]),
                        Iniciales = ComprobarNulos.CheckStringNull(reader["Iniciales"]),
                        IdTipoUsuario = ComprobarNulos.CheckIntNull(reader["IdTipoUsuario"]),
                        Correo = ComprobarNulos.CheckStringNull(reader["CorreoElectronico"]),
                        Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]),
                        DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]),
                        TipoUsuario = ComprobarNulos.CheckStringNull(reader["TipoUsuario"]),
                        Usuario = ComprobarNulos.CheckStringNull(reader["Usuario"]),
                        ArchivoImagen = ComprobarNulos.CheckStringNull(reader["ArchivoImagen"]),
                        CantidadOportunidades = ComprobarNulos.CheckIntNull(reader["NumOportunidades"]),
                        Telefono = ComprobarNulos.CheckStringNull(reader["Telefono"]),
                      //  IdPuesto = ComprobarNulos.CheckIntNull(reader["IdPuesto"]),
                        Puesto = ComprobarNulos.CheckStringNull(reader["PuestoLibre"]),
                    };
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> GuardarImagen(List<IFormFile> imagen, UsuarioDto request)
        {
            BaseOut result = new BaseOut();
            try
            {
                var insertaImagen = new UsuarioDto
                {
                    Bandera = request.Bandera,
                    Nombre = request.Nombre,
                    ApellidoPaterno = request.ApellidoPaterno,
                    ApellidoMaterno = request.ApellidoMaterno,
                    Usuario = request.Usuario,
                    Password = request.Password,
                    Iniciales = request.Iniciales,
                    Correo = request.Correo,
                    Telefono = request.Telefono,
                    IdTipoUsuario = request.IdTipoUsuario,
                   // IdPuesto = request.IdPuesto,
                    Puesto = request.Puesto,
                    IdUsuario = request.IdUsuario,
                    IdEmpresa = request.IdEmpresa,
                    Estatus = request.Estatus,
                    ArchivoImagen = request.ArchivoImagen 
                };

                var resultado = await GuardarUsuarios(insertaImagen);

                result.Result = resultado.Result;
                result.ErrorMessage = resultado.ErrorMessage;
                result.Id = resultado.Id;
                request.IdUsuario = insertaImagen.Bandera == "INSERT" ? resultado.Id: insertaImagen.IdUsuario;

                if (result.Result ?? false)
                {
                    string nombreArchivo = await ProcesarImagenesUsuarioAsync(imagen, request);
                    if(!string.IsNullOrEmpty(nombreArchivo))
                        await ActualizarFotoUsuario(result.Id, nombreArchivo);
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = "Error al guardar el usuario: " + ex.Message;
                result.Result = false;
            }

            return result;
        }
        private async Task<string> ProcesarImagenesUsuarioAsync(List<IFormFile> imagen, UsuarioDto request)
        {
            string result = "";
            var formatosPermitidos = new List<string> { ".jpg", ".png", ".jpeg" };
            string carpetaDestino = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Fotografia");

            if (!Directory.Exists(carpetaDestino))
            {
                Directory.CreateDirectory(carpetaDestino);
            }

            if (imagen != null && imagen.Any())
            {
                foreach (var file in imagen)
                {
                    var extension = Path.GetExtension(file.FileName).ToLower();

                    if (!formatosPermitidos.Contains(extension))
                    {
                        return "";
                    }

                    var nombreBase = $"{(request.ApellidoPaterno ?? "").Trim()}_{(request.ApellidoMaterno ?? "").Trim()}_{(request.Nombre ?? "").Trim()}_{request.IdUsuario.ToString().Trim()}";
                    var nombreArchivoNuevo = $"{nombreBase.Replace(" ", "")}{extension}";
                    var rutaArchivoNuevo = Path.Combine(carpetaDestino, nombreArchivoNuevo);

                    foreach (var formato in formatosPermitidos)
                    {
                        var rutaAnterior = Path.Combine(carpetaDestino, $"{nombreBase}{formato}");
                        if (File.Exists(rutaAnterior))
                        {
                            File.Delete(rutaAnterior);
                        }
                    }

                    using (var stream = new FileStream(rutaArchivoNuevo, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    result = nombreArchivoNuevo;
                }
            }

            return result;
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
           // DataBase.CreateParameterSql("@pIdPuesto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdPuesto ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@PuestoLibre", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Puesto ?? (object)DBNull.Value),
            DataBase.CreateParameterSql("@Telefono", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Telefono)
        };

                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoUsuarios", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        if (request.Bandera == "INSERT")
                        {
                            result.Id = reader["IdUsuario"] != DBNull.Value ? Convert.ToInt32(reader["IdUsuario"]) : 0;
                        }
                    }
                }

                switch (request.Bandera)
                {
                    case "INSERT":
                        if (result.Id > 0)
                        {
                            result.ErrorMessage = "Usuario insertado correctamente.";
                            result.Result = true;
                        }
                        else
                        {
                            result.ErrorMessage = "No se pudo obtener el Id del nuevo usuario.";
                            result.Result = false;
                        }
                        break;

                    case "UPDATE":
                        result.ErrorMessage = "Usuario actualizado correctamente.";
                        result.Id = request.IdUsuario;
                        result.Result = true;
                        break;
                }
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.Id = 0;
                result.ErrorMessage = (request.Bandera == "INSERT")
                    ? "Error al agregar usuario: " + ex.Message
                    : "Error al actualizar usuario: " + ex.Message;
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

        public async Task<BaseOut> ActualizarFotoUsuario(int id, string nombreArchivoNuevo)
            {
            BaseOut result = new BaseOut();

            try
            {
                IList<ParameterSQl> parametros = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "UPDATE-FOTO"),
                    DataBase.CreateParameterSql("@IdUsuario", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, id),
                    DataBase.CreateParameterSql("@NombreArchivo", SqlDbType.VarChar, 300, ParameterDirection.Input, false, null, DataRowVersion.Default, nombreArchivoNuevo)
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
