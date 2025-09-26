using Funnel.Data.Utils;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Funnel.Models.Dto.OpenAiConfiguracion;

namespace Funnel.Logic.Utils.Asistentes
{
    public class AsistenteConFunctionCallings
    {
        public static async Task<ConsultaAsistente> AsistenteConFunciones(ConsultaAsistente consultaAsistente, string apiKey, string modelo)
        {
            var result = await HandleResponseWithFunctionCallAsync(consultaAsistente, apiKey, modelo);
            return consultaAsistente;
        }
        private static async Task<ConsultaAsistente> HandleResponseWithFunctionCallAsync(ConsultaAsistente consultaAsistente, string apiKey, string modelo)
        {
            if (consultaAsistente.Pregunta == null)
            {
                return consultaAsistente;
            }

            var respuestaOpenIA = await CallOpenAIWithFunctionAsync(apiKey, modelo, consultaAsistente);
            consultaAsistente.TokensEntrada = consultaAsistente.TokensEntrada + respuestaOpenIA.TokensEntrada;
            consultaAsistente.TokensSalida = consultaAsistente.TokensSalida + respuestaOpenIA.TokensSalida;
            // Con el resultado obtenido de la función, crear una respuesta de con openia
            var systemMessage = $@"
                        Given a users question and the SQL rows response from the database from which the user wants to get the answer,
                        write a response in spanish to the user's question.
                        <user_question>
                        {consultaAsistente.Pregunta}
                        </user_question>
                        <sql_response>
                        {respuestaOpenIA.Respuesta}
                        </sql_response>
                    ";

            // Define el contexto de open ia
            var messages = new List<Message>
                {
                    new Message { role = "system", content = systemMessage }
                };

            var requestBody = new ChatRequestBody
            {
                model = modelo,
                messages = messages,
                temperature = 0.7
            };

            var chatRespuestaOpenIA = await OpenIAFunciones.ChatCompletionAsync(apiKey, requestBody);
            consultaAsistente.Respuesta = chatRespuestaOpenIA.choices[0].message.content.ToString();
            consultaAsistente.TokensEntrada += chatRespuestaOpenIA.usage.prompt_tokens;
            consultaAsistente.TokensSalida += chatRespuestaOpenIA.usage.total_tokens;
            consultaAsistente.Exitoso = true;
            consultaAsistente.FechaRespuesta = DateTime.Now;

            return consultaAsistente;
        }

        private static async Task<RespuestaOpenIA> CallOpenAIWithFunctionAsync(string apiKey, string modelo, ConsultaAsistente consultaAsistente)
        {
            RespuestaOpenIA respuestaOpenIA = new();
            // Define el mensaje inicial del usuario
            var messages = new List<Message>
                {
                    new Message { role = "user", content = consultaAsistente.Pregunta }
                };

            var propertiesOportunityData = new
            {
                period = new
                {
                    type = "string",
                    description = "The time period for which to query the opportunities (e.g., '2 semanas', '1 mes')"
                }
            };
            var lsFunctionCalls = new List<FunctionCall> {
                    new FunctionCall() {
                        name = "query_opportunity_data",
                        description = "Query opportunity data based on the highest probability of closing in a specified period",
                        parameters = new Dictionary<string, object> { { "type", "object" }, { "properties", propertiesOportunityData }, { "required", new[] { "period" } } },
                     },
                    new FunctionCall() {
                        name = "get_mayorProbabilidadSemana",
                        description = "Retrieve the opportunities with the highest probability of closing in this week.",
                        parameters = new Dictionary<string, object> { { "type", "object" }, { "properties", new { } }},
                     },
                    new FunctionCall() {
                        name = "get_mayorProbabilidad",
                        description = "Retrieve the opportunities with the highest probability of closing.",
                        parameters = new Dictionary<string, object> { { "type", "object" }, { "properties", new { } } },
                     },
                      new FunctionCall() {
                        name = "get_MayorPosibilidadSector",
                        description = "Obtén el sector con mayor número de oportunidades.",
                        parameters = new Dictionary<string, object> { { "type", "object" }, { "properties", new { } } },
                     },
                     new FunctionCall() {
                        name = "get_OportunidadesEnRiesgo",
                        description = "Obtén las oportunidades que tienen riesgo de no cerrarse y los días que no se han atendido",
                        parameters = new Dictionary<string, object> { { "type", "object" }, { "properties", new { } } },
                     },
                 };

            // Crea la solicitud
            var requestBody = new ChatRequestBodyConFunctionCalls
            {
                model = modelo,
                messages = messages,
                temperature = 0.7,
                functions = lsFunctionCalls
            };

            // Llamar a OpenAI con función
            var chatRespuestaOpenIA = await OpenIAFunciones.ChatCompletionAsync(apiKey, requestBody);
            if (chatRespuestaOpenIA.choices[0].message.function_call != null)
            {
                var functionCall = chatRespuestaOpenIA.choices[0].message.function_call;
                var executeFunction = await FunctionCallings.ExecuteFunction(functionCall.name, functionCall.arguments, consultaAsistente);
                respuestaOpenIA.Respuesta = executeFunction;
            }
            respuestaOpenIA.TokensEntrada = chatRespuestaOpenIA.usage.prompt_tokens;
            respuestaOpenIA.TokensSalida = chatRespuestaOpenIA.usage.total_tokens;

            return respuestaOpenIA;
        }

    }
}
