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
    public class InputsAdicionalesData : IInputsAdicionalesData
    {
        private readonly string _connectionString;
        public InputsAdicionalesData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<InputAdicionalDTO>> ConsultarInputsAdicionales(int IdEmpresa, string TipoCatalogo)
        {
            List<InputAdicionalDTO> result = new List<InputAdicionalDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-INPUTS" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                    DataBase.CreateParameterSql("@pTipoCatalogoInput", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, TipoCatalogo )
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_InputsAdicionales", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new InputAdicionalDTO();

                    dto.IdInput = ComprobarNulos.CheckIntNull(reader["IdInput"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.Etiqueta = ComprobarNulos.CheckStringNull(reader["Etiqueta"]);
                    dto.Requerido = ComprobarNulos.CheckBooleanNull(reader["Requerido"]);
                    dto.TipoCampo = ComprobarNulos.CheckStringNull(reader["TipoCampo"]);
                    dto.RCatalogoInputId = ComprobarNulos.CheckIntNull(reader["RCatalogoInputId"]);
                    dto.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                    dto.TipoCatalogoInput = "";
                    dto.Orden = 0;


                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<InputAdicionalDTO>> ConsultarInputsPorCatalogo(int IdEmpresa, string TipoCatalogo)
        {
            List<InputAdicionalDTO> result = new List<InputAdicionalDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-INPUTS-CATALOGO" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                    DataBase.CreateParameterSql("@pTipoCatalogoInput", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, TipoCatalogo )
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_InputsAdicionales", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new InputAdicionalDTO();

                    dto.IdInput = ComprobarNulos.CheckIntNull(reader["IdInput"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.Etiqueta = ComprobarNulos.CheckStringNull(reader["Etiqueta"]);
                    dto.Requerido = ComprobarNulos.CheckBooleanNull(reader["Requerido"]);
                    dto.TipoCampo = ComprobarNulos.CheckStringNull(reader["TipoCampo"]);
                    dto.RCatalogoInputId = ComprobarNulos.CheckIntNull(reader["RCatalogoInputId"]);
                    dto.TipoCatalogoInput = ComprobarNulos.CheckStringNull(reader["TipoCatalogoInput"]);
                    dto.Orden = ComprobarNulos.CheckIntNull(reader["Orden"]);
                    dto.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);


                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<InputAdicionalDataDTO>> ConsultarDataInputsAdicionales(int IdEmpresa, string TipoCatalogo, int IdReferencia)
        {
            List<InputAdicionalDataDTO> result = new List<InputAdicionalDataDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-INPUTS-CATALOGO-DATA" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                    DataBase.CreateParameterSql("@pTipoCatalogoInput", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, TipoCatalogo ),
                    DataBase.CreateParameterSql("@pIdReferencia", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdReferencia ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_InputsAdicionales", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new InputAdicionalDataDTO();

                    dto.IdInput = ComprobarNulos.CheckIntNull(reader["IdInput"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.Etiqueta = ComprobarNulos.CheckStringNull(reader["Etiqueta"]);
                    dto.Requerido = ComprobarNulos.CheckBooleanNull(reader["Requerido"]);
                    dto.TipoCampo = ComprobarNulos.CheckStringNull(reader["TipoCampo"]);
                    dto.RCatalogoInputId = ComprobarNulos.CheckIntNull(reader["RCatalogoInputId"]);
                    dto.Orden = ComprobarNulos.CheckIntNull(reader["Orden"]);
                    dto.TipoCatalogoInputId = ComprobarNulos.CheckIntNull(reader["TipoCatalogoInputId"]);
                    dto.TipoCatalogoInput = ComprobarNulos.CheckStringNull(reader["TipoCatalogoInput"]);
                    dto.IdInputData = ComprobarNulos.CheckIntNull(reader["IdInputData"]);
                    dto.Valor = ComprobarNulos.CheckStringNull(reader["Valor"]);
                    dto.IdReferencia = ComprobarNulos.CheckIntNull(reader["IdReferencia"]);


                    result.Add(dto);
                }
            }
            return result;

        }

        public async Task<BaseOut> GuardarInputsAdicionales(List<InputAdicionalDTO> listaInputs, int IdEmpresa)
        {
            BaseOut result = new BaseOut();
            DataTable dtPermisos = new DataTable("InputsCatalogo");
            var tipoCatalogo = listaInputs.First().TipoCatalogoInput;

            dtPermisos.Columns.Add(new DataColumn("RCatalogoInputId", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("InputId", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("Activo", typeof(bool)));
            dtPermisos.Columns.Add(new DataColumn("Orden", typeof(int)));

            foreach (var item in listaInputs)
            {
                DataRow row = dtPermisos.NewRow();
                row["RCatalogoInputId"] = item.RCatalogoInputId;
                row["InputId"] = item.IdInput;
                row["Activo"] = item.Activo;
                row["Orden"] = item.Orden;
                dtPermisos.Rows.Add(row);
            }

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "INS-INPUT-ADICIONAL" ),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                DataBase.CreateParameterSql("@pTipoCatalogoInput", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, tipoCatalogo ),
                DataBase.CreateParameterSql("@pInputsCatalogo", SqlDbType.Structured, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, dtPermisos)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_InputsAdicionales", CommandType.StoredProcedure, list, _connectionString))

                result.ErrorMessage = "Inputs guardados correctamente.";
                result.Id = 1;
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = $"Error al guardar inputs: {ex.Message}";
                result.Id = 0;
                result.Result = false;
            }

            return result;
        }

        public async Task<BaseOut> GuardarInputsAdicionalesData(List<InputAdicionalDataDTO> listaInputsData)
        {
            BaseOut result = new BaseOut();
            DataTable dtPermisos = new DataTable("InputsCatalogoData");

            dtPermisos.Columns.Add(new DataColumn("CatalogoInputDataId", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("RCatalogoInputId", typeof(int)));
            dtPermisos.Columns.Add(new DataColumn("Valor", typeof(string)));
            dtPermisos.Columns.Add(new DataColumn("ReferenciaId", typeof(int)));

            foreach (var item in listaInputsData)
            {
                DataRow row = dtPermisos.NewRow();
                row["CatalogoInputDataId"] = item.IdInputData;
                row["RCatalogoInputId"] = item.RCatalogoInputId;
                row["Valor"] = item.Valor;
                row["ReferenciaId"] = item.IdReferencia;
                dtPermisos.Rows.Add(row);
            }

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "INS-INPUT-ADICIONAL-DATA" ),
                DataBase.CreateParameterSql("@pInputsCatalogoData", SqlDbType.Structured, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, dtPermisos)
            };

            try
            {
                using (IDataReader reader = await DataBase.GetReaderSql("F_InputsAdicionales", CommandType.StoredProcedure, list, _connectionString))

                    result.ErrorMessage = "Datos adicionales guardados correctamente.";
                result.Id = 1;
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = $"Error al guardar datos adicionales: {ex.Message}";
                result.Id = 0;
                result.Result = false;
            }

            return result;
        }
    }
}
