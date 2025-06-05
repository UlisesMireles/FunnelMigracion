using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Funnel.Data
{
    public class ConfiguracionesData
    {
        private readonly string _connectionString;

        public ConfiguracionesData(IConfiguration configuration)
        {
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? string.Empty;
        }

        public async Task<ListaConfiguracionesDto> Configuraciones()
        {
            var config = new List<ConfiguracionDto>();
            var lista = new ListaConfiguracionesDto();
            try
            {
                using (IDataReader reader = await DataBase.GetReader("F_ConfiguracionAsistentes", CommandType.StoredProcedure, _connectionString))
                {
                    while (reader.Read())
                    {
                        var ren = new ConfiguracionDto();
                        ren.IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]);
                        ren.Asistente = ComprobarNulos.CheckStringNull(reader["Asistente"]);
                        ren.NombreTablaAsistente = ComprobarNulos.CheckStringNull(reader["NombreTablaAsistente"]);
                        ren.MensajePrincipalAsistente = ComprobarNulos.CheckStringNull(reader["MensajePrincipalAsistente"]);
                        ren.Llave = ComprobarNulos.CheckStringNull(reader["Llave"]);
                        ren.Modelo = ComprobarNulos.CheckStringNull(reader["Modelo"]);
                        ren.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                       // ren.CostoTokensEntrada = ComprobarNulos.CheckDoubleNull(reader["CostoTokensEntrada"]);
                      //  ren.CostoTokensSalida = ComprobarNulos.CheckDoubleNull(reader["CostoTokensSalida"]);
                        ren.MaximoTokens = ComprobarNulos.CheckIntNull(reader["MaximoTokens"]);
                        ren.Creditos = ComprobarNulos.CheckDecimalNull(reader["Creditos"]);
                        config.Add(ren);
                    }

                    lista.Configuraciones = config;
                    lista.Result = true;
                }
            }
            catch (Exception ex)
            {
                lista.Result = false;
                lista.ErrorMessage = ex.Message;
            }

            return lista;
        }

        public async Task<ConfiguracionDto> ConfiguracionPorIdBot(int idBot)
        {
            var dto = new ConfiguracionDto();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@IdBot", DbType.String, 30, ParameterDirection.Input, false, "IdBot", DataRowVersion.Default, idBot)
                };

                using (IDataReader reader = await DataBase.GetReader("F_ConfiguracionAsistentesPorIdBot", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        dto.IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]);
                        dto.Asistente = ComprobarNulos.CheckStringNull(reader["Asistente"]);
                        dto.NombreTablaAsistente = ComprobarNulos.CheckStringNull(reader["NombreTablaAsistente"]);
                        dto.MensajePrincipalAsistente = ComprobarNulos.CheckStringNull(reader["MensajePrincipalAsistente"]);
                        dto.Llave = ComprobarNulos.CheckStringNull(reader["Llave"]);
                        dto.Modelo = ComprobarNulos.CheckStringNull(reader["Modelo"]);
                        dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                       // dto.CostoTokensEntrada = ComprobarNulos.CheckDoubleNull(reader["CostoTokensEntrada"]);
                       // dto.CostoTokensSalida = ComprobarNulos.CheckDoubleNull(reader["CostoTokensSalida"]);
                        dto.MaximoTokens = ComprobarNulos.CheckIntNull(reader["MaximoTokens"]);
                        dto.Creditos = ComprobarNulos.CheckDecimalNull(reader["Creditos"]);
                        dto.RutaDocumento = ComprobarNulos.CheckStringNull(reader["RutaDocumento"]);
                        dto.Result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                dto.Result = false;
                dto.ErrorMessage = ex.Message;
            }

            return dto;
        }

        public async Task<bool> VerificaAutorización(string key)
        {
            using var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);

            var response = await httpClient.GetAsync("https://api.openai.com/v1/engines");
            return response.IsSuccessStatusCode;
        }

        public bool FormatoValido(string key)
        {
            if (key.Contains("-proj-"))
            {
                return Regex.IsMatch(key, @"^sk-proj-[a-zA-Z0-9_-]{74}T3BlbkFJ[a-zA-Z0-9_-]{74}$");
            }
            else
            {
                return Regex.IsMatch(key, @"^sk-[a-zA-Z0-9_-]{42}T3BlbkFJ[a-zA-Z0-9_-]{42}$");
            }
        }
    }
}

