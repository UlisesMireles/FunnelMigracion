using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Funnel.Models.Dto.OpenAiConfiguracion;

namespace Funnel.Logic.Utils.Asistentes
{
    public class AsistenteAccionesRiesgos
    {
        private static readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        private static string _threadId;

        public static async Task<ConsultaAsistente> AsistenteOpenAIAsync(ConsultaAsistente consultaAsistente, ConfiguracionDto config)
        {
            if (string.IsNullOrEmpty(consultaAsistente.Pregunta.Trim()))
            {
                return consultaAsistente;
            }

            try
            {
                string sqlQuery = string.Empty;
                AsistenteAccionesRiesgos instanceService = new();
                if (consultaAsistente.EsPreguntaFrecuente)
                {
                    sqlQuery = CondicionesSql.Condicion(consultaAsistente.Respuesta, consultaAsistente);
                }
                else
                {
                    var schemaJson = await BD.GetJsonDataAsync("select * from information_schema.columns where table_name = 'ConsultaGeneralOportunidades'");
                    var lsSchema = JsonConvert.DeserializeObject<List<ConsultaGeneralOportunidadesSchema>>(schemaJson);
                    if (lsSchema == null)
                    {
                        return consultaAsistente;
                    }
                    foreach (var schema in lsSchema)
                    {
                        if (schema.DataType == "bit")
                        {
                            schema.DataType = "boolean";
                        }
                    }

                    var respuestaHumanQueryToSql = await instanceService.HumanQueryToSql(lsSchema, consultaAsistente.Pregunta, config.Llave, config.Modelo);
                    if (respuestaHumanQueryToSql.Respuesta == null)
                    {
                        return consultaAsistente;
                    }

                    consultaAsistente.TokensEntrada += respuestaHumanQueryToSql.TokensEntrada;
                    consultaAsistente.TokensSalida += respuestaHumanQueryToSql.TokensSalida;

                    var stringHumanQueryResponse = JsonConvert.DeserializeObject<HumanQuery>(respuestaHumanQueryToSql.Respuesta);
                    if (stringHumanQueryResponse == null)
                    {
                        return consultaAsistente;
                    }
                    if (stringHumanQueryResponse.error_question == 1)
                    {
                        consultaAsistente.Respuesta = "Tu pregunta no es valida, has otra pregunta";
                        return consultaAsistente;
                    }

                    sqlQuery = CondicionesSql.Condicion(stringHumanQueryResponse.sql_query, consultaAsistente);
                }

                var dataHumanQuery = await BD.GetJsonDataAsync(sqlQuery);

                //var modeloOpenAi = _lsModeloOpenAi.First(item => item.Nombre == modeloOpenAI);
                var countTokensHumanQuery = TokenHelper.CountTokens(config.Modelo, dataHumanQuery);
                RespuestaOpenIA respuestaOpenIA;
                if (countTokensHumanQuery < config.MaximoTokens)
                {
                    respuestaOpenIA = await instanceService.BuildAnswer(consultaAsistente.Pregunta, dataHumanQuery, sqlQuery, false, config);
                    consultaAsistente.TokensEntrada += respuestaOpenIA.TokensEntrada;
                    consultaAsistente.TokensSalida += respuestaOpenIA.TokensSalida;
                }
                else
                {
                    sqlQuery = sqlQuery.Replace("SELECT", "SELECT TOP 3");
                    var dataHumanQueryAgain = await BD.GetJsonDataAsync(sqlQuery);

                    respuestaOpenIA = await instanceService.BuildAnswer(consultaAsistente.Pregunta, dataHumanQueryAgain, sqlQuery, true, config);
                    consultaAsistente.TokensEntrada += respuestaOpenIA.TokensEntrada;
                    consultaAsistente.TokensSalida += respuestaOpenIA.TokensSalida;
                }

                // Asignamos los resultados de salida
                consultaAsistente.Exitoso = true;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                consultaAsistente.Respuesta = respuestaOpenIA.Respuesta;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error= " + ex.Message);
                consultaAsistente.Exitoso = false;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                consultaAsistente.Respuesta = "Ocurrió un error al generar la consulta, podrías especificar mejor tu pregunta ";
            }

            return consultaAsistente;
        }

        private async Task<RespuestaOpenIA> HumanQueryToSql(List<ConsultaGeneralOportunidadesSchema> lsSchema, string human_query, string apiKey, string modeloOpenAI)
        {
            var respuestaOpenIA = new RespuestaOpenIA();

            var systemMessage = $@"
                Given the following schema, write a SQL query that retrieves the requested information from the table ConsultaGeneralOportunidades only with select, strings in where use like, if a column use a function add an alias, boolean handle with 1 or 0, use top instead limit. 
                Return the SQL query inside a JSON structure, like the example with the key ""sql_query"" and ""error_question"" with 0 and ""error_message"" as empty. 
                If the question cant convert, return ""error_message"" with a friendly answer that the question is not valid and add ""error_question"" with 1
                <example>{{
                    ""sql_query"": ""SELECT * FROM ConsultaGeneralOportunidades WHERE estatusOportunidad LIKE '%En Proceso%'"",
                    ""original_query"": ""Show me all opportunities with status 'En Proceso'."",
                    ""error_question"": 1,
                    ""error_message"": ""Your question is not valid""
                }}
                </example>
                <schema>
                {JsonConvert.SerializeObject(lsSchema)}
                </schema>
                ";

            var body = new
            {
                model = modeloOpenAI,
                input = new[]
                {
                    new { role = "system", content = systemMessage },
                    new { role = "user", content = human_query }
                }
            };

            var client = OpenAIUtils.GetClient(apiKey);
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("responses", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var text = doc.RootElement
                          .GetProperty("output")[0]
                          .GetProperty("content")[0]
                          .GetProperty("text")
                          .GetString();

            respuestaOpenIA.Respuesta = text.Replace("```json", "").Replace("```", "").Trim();

            if (doc.RootElement.TryGetProperty("usage", out var usage))
            {
                respuestaOpenIA.TokensEntrada = usage.GetProperty("input_tokens").GetInt32();
                respuestaOpenIA.TokensSalida = usage.GetProperty("output_tokens").GetInt32();
            }

            return respuestaOpenIA;
        }

        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, string dataHumanQuery, string humanQuery, bool excedeLimite, ConfiguracionDto config)
        {
            var respuestaOpenIA = new RespuestaOpenIA();

            if (string.IsNullOrWhiteSpace(dataHumanQuery))
            {
                respuestaOpenIA.Respuesta = "No se encontró información relacionada con tu consulta.";
                respuestaOpenIA.TokensEntrada = 0;
                respuestaOpenIA.TokensSalida = 0;
                return respuestaOpenIA;
            }

            //var excede = "";
            var systemMessage = $@"
                        Given a users question and the SQL rows response from the database from which the user wants to get the answer,
                        write a response in spanish. only answer with 3 sql rows if you have more than 3 rows.Return the answer without **, use as reference the examples. tables return as html
                        <example1>
                         <label> <!-- here the response, mark bold important information --> </label>
                         <!-- example div if has detail -->
                         <b><!-- NombreOportunidad --></b>
                         <ul>
                           <li>Monto: <b>$200,000.00</b>  </li>
                           <li>Prospecto: ARCA</li>
                           <li>Fecha de cierre estimada: 28 de febrero de 2023 </li>
                           <li>Fecha de registro: 28 de febrero de 2023 </li>
                         </ul>
                        </example1>
                        <example2>
                           <label> <!-- here the response, mark bold important information --> </label>
                           <!-- example div if has detail -->
                           <b>- Ulises Mireles</b>
                           <b>- Carlos Bernadac</b>
                           <b>- Antonio Mendoza</b>
                        </example2>
                        <original_question>
                            {pregunta}
                        </original_question>
                        <sql_response>
                        {dataHumanQuery}
                        </sql_response>
                    ";
            //if (excedeLimite)
            //{
            //    excede = "Tu pregunta excede el limite de datos, te mostraremos los ultimos 5 datos: \n ";
            //}

            var body = new
            {
                model = config.Modelo,
                input = new[]
                {
                    new { role = "system", content = systemMessage }
                }
            };

            var client = OpenAIUtils.GetClient(config.Llave);
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("responses", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var text = doc.RootElement
                          .GetProperty("output")[0]
                          .GetProperty("content")[0]
                          .GetProperty("text")
                          .GetString();

            respuestaOpenIA.Respuesta = text;

            if (doc.RootElement.TryGetProperty("usage", out var usage))
            {
                respuestaOpenIA.TokensEntrada = usage.GetProperty("input_tokens").GetInt32();
                respuestaOpenIA.TokensSalida = usage.GetProperty("output_tokens").GetInt32();
            }

            return respuestaOpenIA;
        }
        public static async Task<GeneraConsultaDto> GeneraConsultaAdmin(GeneraConsultaDto dto, ConfiguracionDto config)
        {
            dto.FechaPregunta = DateTime.Now;
            if (string.IsNullOrEmpty(dto.Pregunta.Trim()))
            {
                dto.Result = false;
                dto.ErrorMessage = "Por favor introduzca una pregunta.";
                return dto;
            }

            try
            {
                var schemaJson = await BD.GetJsonDataAsync("select * from information_schema.columns where table_name = 'ConsultaGeneralOportunidades'");
                var lsSchema = JsonConvert.DeserializeObject<List<ConsultaGeneralOportunidadesSchema>>(schemaJson);
                if (lsSchema == null)
                {
                    dto.Result = false;
                    dto.ErrorMessage = "Tu pregunta no es valida, has otra pregunta";
                    return dto;
                }
                foreach (var schema in lsSchema)
                {
                    if (schema.ColumnName == "Riesgo")
                    {
                        schema.DataType = "boolean";
                    }
                }

                AsistenteAccionesRiesgos instanceService = new();
                var respuestaHumanQueryToSql = await instanceService.HumanQueryToSql(lsSchema, dto.Pregunta, config.Llave, config.Modelo);
                if (respuestaHumanQueryToSql.Respuesta == null)
                {
                    dto.Result = false;
                    return dto;
                }
                dto.FechaRespuesta = DateTime.Now;
                dto.TokensEntrada = respuestaHumanQueryToSql.TokensEntrada;
                dto.TokensSalida = respuestaHumanQueryToSql.TokensSalida;

                var stringHumanQueryResponse = JsonConvert.DeserializeObject<HumanQuery>(respuestaHumanQueryToSql.Respuesta);
                if (stringHumanQueryResponse == null)
                {
                    dto.Result = false;
                    return dto;
                }
                if (stringHumanQueryResponse.error_question == 1)
                {
                    dto.Result = false;
                    dto.ErrorMessage = "Tu pregunta no es valida, has otra pregunta";
                    return dto;
                }
                dto.Consulta = stringHumanQueryResponse.sql_query;
                dto.Result = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error= " + ex.Message);
                dto.Result = false;
                dto.FechaRespuesta = DateTime.Now;
                dto.ErrorMessage = "Ocurrió un error al generar la consulta, podrías especificar mejor tu pregunta";
            }

            return dto;
        }
    }
}
