using Microsoft.Extensions.Configuration;
using Funnel.Models.Base;
using Funnel.Data.Interfaces;
using Funnel.Data.Utils;
using System.Data;
using Funnel.Models.Dto;
using System.Linq.Expressions;
namespace Funnel.Data
{
    public class EmpresaData : IEmpresaData
    {
        private readonly string _connectionString;
        public EmpresaData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<BaseOut> GuardarEmpresa(GuardarEmpresaDto request)
        {
            BaseOut result = new BaseOut();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "INS-EMPRESA-GLU"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdEmpresa ),
                DataBase.CreateParameterSql("@pNombreEmpresa", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreEmpresa ?? (object)DBNull.Value ),
                DataBase.CreateParameterSql("@pIdAdministrador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdAdministrador),
                DataBase.CreateParameterSql("@pIdLicencia", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdLicencia),
                DataBase.CreateParameterSql("@pAlias", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Alias ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pRFC", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Rfc ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pVInicio", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.VInicio),
                DataBase.CreateParameterSql("@pVTerminacion", SqlDbType.DateTime, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.VTerminacion),
                DataBase.CreateParameterSql("@pUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UsuarioCreador),
                DataBase.CreateParameterSql("@pNombre", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value ),
                DataBase.CreateParameterSql("@pApellidoPaterno", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoPaterno ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pApellidoMaterno", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.ApellidoMaterno ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pIniciales", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Iniciales ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pCorreo", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Correo ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pUsuario", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Usuario ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pUrlSitio", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UrlSitio ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pActivo", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Activo),
                DataBase.CreateParameterSql("@pPermitirDecimales", SqlDbType.Bit, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.PermitirDecimales),
                DataBase.CreateParameterSql("@pPassword", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, Encrypt.Encriptar(request.Password)),
                DataBase.CreateParameterSql("@pDireccion", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Direccion ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@pTamano", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Tamano ?? (object)DBNull.Value),

            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
                {
                    result.ErrorMessage = "Datos Guardados correctamente.";
                    result.Id = 1;
                    result.Result = true;
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                result.Id = 0;
                result.Result = false;
            }

            return result;
        }

        public async Task<BaseOut> GuardarRegistroTemporal(GuardarRegistroTemporalDto request)
        {
            BaseOut result = new BaseOut();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@Bandera", SqlDbType.VarChar, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera),
                DataBase.CreateParameterSql("@IdRegistro", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, request.IdRegistro ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 100, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@Correo", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Correo ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@Usuario", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Usuario ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@RFC", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.RFC ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@NombreEmpresa", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.NombreEmpresa ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@Direccion", SqlDbType.NVarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Direccion ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@UrlSitio", SqlDbType.VarChar, 500, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UrlSitio ?? (object)DBNull.Value),
                DataBase.CreateParameterSql("@TamanoEmpresa", SqlDbType.VarChar, 20, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Tamano ?? (object)DBNull.Value),
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("sp_GestionNuevoRegistroTemporal", CommandType.StoredProcedure, list, _connectionString))
                {
                    if (reader.Read())
                    {
                        result.Id = Convert.ToInt32(reader[0]);
                        result.Result = true;
                        result.ErrorMessage = "Registro procesado correctamente.";
                    }
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                result.Id = 0;
                result.Result = false;
            }

        public async Task<List<GuardarEmpresaDto>> ConsultarEmpresas()
        {
            List<GuardarEmpresaDto> result = new List<GuardarEmpresaDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-EMPRESAS"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_Tenant", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new GuardarEmpresaDto();
                    dto.IdEmpresa = ComprobarNulos.CheckIntNull(reader["IdEmpresa"]);
                    dto.NombreEmpresa = ComprobarNulos.CheckStringNull(reader["NombreEmpresa"]);
                    dto.Alias = ComprobarNulos.CheckStringNull(reader["Alias"]);
                    dto.Rfc = ComprobarNulos.CheckStringNull(reader["RFC"]);
                    dto.VInicio = ComprobarNulos.CheckDateTimeNull(reader["VInicio"]);
                    dto.VTerminacion = ComprobarNulos.CheckDateTimeNull(reader["VTerminacion"]);
                    dto.IdLicencia = ComprobarNulos.CheckIntNull(reader["IdLicencia"]);
                    dto.IdAdministrador = ComprobarNulos.CheckIntNull(reader["IdAdministrador"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.ApellidoPaterno = ComprobarNulos.CheckStringNull(reader["ApellidoPaterno"]);
                    dto.ApellidoMaterno = ComprobarNulos.CheckStringNull(reader["ApellidoMaterno"]);
                    dto.Activo = ComprobarNulos.CheckIntNull(reader["Activo"]);
                    dto.UrlSitio = ComprobarNulos.CheckStringNull(reader["UrlSitio"]);
                    dto.PermitirDecimales = ComprobarNulos.CheckBooleanNull(reader["PermitirDecimales"]);

                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
