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
    public class ConfiguracionTablasData : IConfiguracionTablasData
    {
        private readonly string _connectionString;
        public ConfiguracionTablasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<List<ConfiguracionTablasDto>> ObtenerConfiguracionTabla(RequestConfigracionTablaDto data)
        {
            List<ConfiguracionTablasDto> result = new List<ConfiguracionTablasDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdTabla", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdTabla),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario),
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_ConfiguracionColumnas_ConsultarColumnasPorIdTabla", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new ConfiguracionTablasDto();
                        dto.IdTabla = data.IdTabla;
                        dto.IdColumna = ComprobarNulos.CheckIntNull(reader["IdColumna"]);
                        dto.Key = ComprobarNulos.CheckStringNull(reader["Llave"]);
                        dto.Valor = ComprobarNulos.CheckStringNull(reader["Valor"]);
                        dto.TipoFormato = ComprobarNulos.CheckStringNull(reader["TipoFormato"]);
                        dto.IsCheck = ComprobarNulos.CheckBooleanNull(reader["IsChecked"]);
                        dto.IsIgnore = ComprobarNulos.CheckBooleanNull(reader["IsIgnore"]);
                        dto.IsTotal = ComprobarNulos.CheckBooleanNull(reader["IsTotal"]);
                        dto.GroupColumn = ComprobarNulos.CheckBooleanNull(reader["GroupColumn"]);

                        result.Add(dto);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la ConfiguracionTabla", ex);

            }

            return result;
        }
        public async Task<BaseOut> GuardarConfiguracionTabla(RequestConfigracionTablaDto data)
        {
            BaseOut result = new BaseOut();
            DataTable dtDetalle = GetDataTableConfiguracion(data);
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pIdTabla", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdTabla),
                DataBase.CreateParameterSql("@pIdUsuario", SqlDbType.Int, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, data.IdUsuario),
                DataBase.CreateParameterSql("@pConfiguracion", SqlDbType.Structured, int.MaxValue, ParameterDirection.Input,false,null,DataRowVersion.Default, dtDetalle)
            };
            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_ConfiguracionColumnas_InsertarConfiguracionColumnas", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        result.Result= ComprobarNulos.CheckBooleanNull(reader["Ok"]);
                        result.ErrorMessage = ComprobarNulos.CheckStringNull(reader["Error"]);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al guardar ConfiguracionTabla", ex);

            }

            return result;
        }
        private DataTable GetDataTableConfiguracion(RequestConfigracionTablaDto configuracion)
        {
            DataRow row;
            DataTable dtConfiguracion = new DataTable("RelacionConfiguracionColumnasUsuarioType");
            DataColumn column = new DataColumn
            {
                DataType = typeof(int),
                ColumnName = "IdTabla",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(int),
                ColumnName = "IdColumna",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(int),
                ColumnName = "IdUsuario",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(bool),
                ColumnName = "IsChecked",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(bool),
                ColumnName = "IsIgnore",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(bool),
                ColumnName = "IsTotal",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
            column = new DataColumn
            {
                DataType = typeof(bool),
                ColumnName = "GroupColumn",
                ReadOnly = true
            };
            dtConfiguracion.Columns.Add(column);
           
            foreach (var item in configuracion.ConfiguracionTabla)
            {
                row = dtConfiguracion.NewRow();
                row["IdTabla"] = configuracion.IdTabla;
                row["IdColumna"] = item.IdColumna;
                row["IdUsuario"] = configuracion.IdUsuario;
                row["IsChecked"] = item.IsCheck;
                row["IsTotal"] = item.IsTotal;
                row["IsIgnore"] = item.IsIgnore;
                row["GroupColumn"] = item.GroupColumn;
                dtConfiguracion.Rows.Add(row);
            }
            return dtConfiguracion;
        }
    }
}
