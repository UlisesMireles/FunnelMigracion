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
    public class ProspectoData : IProspectoData
    {
        private readonly string _connectionString;
        public ProspectoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<List<ComboSectoresDto>> ComboSectores()
        {
            List<ComboSectoresDto> result = new List<ComboSectoresDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "SEL-SECTORES-CMB"),
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoSectores", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ComboSectoresDto();
                    dto.IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.DescripcionSector = ComprobarNulos.CheckStringNull(reader["DescripcionSector"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ProspectoDTO>> ConsultarProspectos(int IdEmpresa)
        {
            List<ProspectoDTO> result = new List<ProspectoDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT" ),
                    DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@UsbicacionFisica", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value ),
                    DataBase.CreateParameterSql("@IdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, 0 ),
                    DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, 0 ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, IdEmpresa ),
                    DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, 0 )
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ProspectoDTO();
                    dto.IdProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.UbicacionFisica = ComprobarNulos.CheckStringNull(reader["UbicacionFisica"]);
                    dto.Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]);
                    dto.DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]);
                    dto.NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.TotalOportunidades = ComprobarNulos.CheckIntNull(reader["TotalOportunidades"]);
                    dto.Proceso = ComprobarNulos.CheckIntNull(reader["Proceso"]);
                    dto.Ganadas = ComprobarNulos.CheckIntNull(reader["Ganadas"]);
                    dto.Perdidas = ComprobarNulos.CheckIntNull(reader["Perdidas"]);
                    dto.Canceladas = ComprobarNulos.CheckIntNull(reader["Canceladas"]);
                    dto.Eliminadas = ComprobarNulos.CheckIntNull(reader["Eliminadas"]);
                    dto.PorcEfectividad = ComprobarNulos.CheckDecimalNull(reader["PorcEfectividad"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<ProspectoDTO>> ConsultarTopVeinte(int IdEmpresa, string Anio)
        {
            List<ProspectoDTO> result = new List<ProspectoDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
    {
        DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "SELECT-TOPVEINTE-POR-ANIO"),
        DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
        DataBase.CreateParameterSql("@UsbicacionFisica", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, DBNull.Value),
        DataBase.CreateParameterSql("@IdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 0),
        DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 0),
        DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, IdEmpresa),
        DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 0),
        DataBase.CreateParameterSql("@pAnio", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, !string.IsNullOrEmpty(Anio) ? Anio : DBNull.Value),
    };

            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ProspectoDTO();
                    dto.IdProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    dto.Nombre = ComprobarNulos.CheckStringNull(reader["Nombre"]);
                    dto.UbicacionFisica = ComprobarNulos.CheckStringNull(reader["UbicacionFisica"]);
                    dto.Estatus = ComprobarNulos.CheckIntNull(reader["Estatus"]);
                    dto.DesEstatus = ComprobarNulos.CheckStringNull(reader["DesEstatus"]);
                    dto.NombreSector = ComprobarNulos.CheckStringNull(reader["NombreSector"]);
                    dto.IdSector = ComprobarNulos.CheckIntNull(reader["IdSector"]);
                    dto.TotalOportunidades = ComprobarNulos.CheckIntNull(reader["TotalOportunidades"]);
                    dto.Proceso = ComprobarNulos.CheckIntNull(reader["Proceso"]);
                    dto.Ganadas = ComprobarNulos.CheckIntNull(reader["Ganadas"]);
                    dto.Perdidas = ComprobarNulos.CheckIntNull(reader["Perdidas"]);
                    dto.Canceladas = ComprobarNulos.CheckIntNull(reader["Canceladas"]);
                    dto.Eliminadas = ComprobarNulos.CheckIntNull(reader["Eliminadas"]);
                    dto.PorcGanadas = ComprobarNulos.CheckDecimalNull(reader["PorcGanadas"]);
                    dto.PorcPerdidas = ComprobarNulos.CheckDecimalNull(reader["PorcPerdidas"]);
                    dto.PorcCanceladas = ComprobarNulos.CheckDecimalNull(reader["PorcCanceladas"]);
                    dto.PorcEliminadas = ComprobarNulos.CheckDecimalNull(reader["PorcEliminadas"]);
                    dto.UltimaFechaRegistro = ComprobarNulos.CheckDateTimeNull(reader["UltimaFecha"]);

                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<AniosDto>> ConsultarAniosOportunidades(int idEmpresa)
        {
            List<AniosDto> result = new List<AniosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "ANIOS-OPORTUNIDADES"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new AniosDto();
                    dto.IdEmpresa = idEmpresa;
                    dto.Anio = ComprobarNulos.CheckIntNull(reader["Anio"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<List<AniosDto>> ConsultarAniosGraficas(int idEmpresa)
        {
            List<AniosDto> result = new List<AniosDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, "ANIOS-TOP-20"),
                DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 10, ParameterDirection.Input, false, null, DataRowVersion.Default, idEmpresa)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new AniosDto();
                    dto.IdEmpresa = idEmpresa;
                    dto.Anio = ComprobarNulos.CheckIntNull(reader["Anio"]);
                    result.Add(dto);
                }
            }
            return result;
        }

        public async Task<BaseOut> GuardarProspecto(ProspectoDTO request)
        {
            BaseOut result = new BaseOut();
            try
            {
                int idProspecto = 0;
                IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Bandera ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@Nombre", SqlDbType.VarChar, 50, ParameterDirection.Input, false, null, DataRowVersion.Default, request.Nombre ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@UsbicacionFisica", SqlDbType.VarChar, 200, ParameterDirection.Input, false, null, DataRowVersion.Default, request.UbicacionFisica ?? (object)DBNull.Value ),
                    DataBase.CreateParameterSql("@IdProspecto", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdProspecto ),
                    DataBase.CreateParameterSql("@Estatus", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.Estatus ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdEmpresa ),
                    DataBase.CreateParameterSql("@pIdSector", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.IdSector ),
                    DataBase.CreateParameterSql("@pUsuarioCreador", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, request.UsuarioCreador )
                };

                // Ejecutar el SP sin leer datos
                using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
                {
                    while (reader.Read())
                    {
                        idProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    }
                }
                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Prospecto insertado correctamente.";
                        result.Id = idProspecto;
                        result.Result = true;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Prospecto actualizado correctamente.";
                        result.Id = 1;
                        result.Result = true;
                        break;
                }

            }
            catch (Exception ex)
            {

                switch (request.Bandera)
                {
                    case "INSERT":
                        result.ErrorMessage = "Error al insertar prospecto: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                    case "UPDATE":
                        result.ErrorMessage = "Error al actualizar prospecto: " + ex.Message;
                        result.Id = 0;
                        result.Result = false;
                        break;
                }
            }
            return result;
        }

        public async Task<List<string>> ColumnasAdicionales(int idEmpresa)
        {
            List<string> result = new List<string>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "COLUMNAS-ADICIONALES" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, idEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    result.Add(ComprobarNulos.CheckStringNull(reader["NombreCampo"]));
                }
            }
            return result;
        }

        public async Task<List<ProspectoDTO>> ColumnasAdicionalesData(int idEmpresa, List<string> nombresColumnas)
        {
            List<ProspectoDTO> result = new List<ProspectoDTO>();
            IList<ParameterSQl> list = new List<ParameterSQl>
                {
                    DataBase.CreateParameterSql("@pBandera", SqlDbType.VarChar, 30, ParameterDirection.Input, false, null, DataRowVersion.Default, "COLUMNAS-ADICIONALES-DATA" ),
                    DataBase.CreateParameterSql("@pIdEmpresa", SqlDbType.Int, 0, ParameterDirection.Input, false,null, DataRowVersion.Default, idEmpresa ),
                };
            using (IDataReader reader = await DataBase.GetReaderSql("F_CatalogoProspectos", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ProspectoDTO();
                    dto.IdProspecto = ComprobarNulos.CheckIntNull(reader["IdProspecto"]);
                    foreach (var columna in nombresColumnas)
                    {
                        dto.PropiedadesAdicionales[columna] = ComprobarNulos.CheckStringNull(reader[columna]);
                    }
                    result.Add(dto);
                }
            }
            return result;
        }
    }
}
