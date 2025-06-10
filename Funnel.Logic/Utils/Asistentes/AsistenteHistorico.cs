using Microsoft.Extensions.Configuration;
using Funnel.Models.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Utils;
using static Funnel.Models.Dto.OpenAiConfiguracion;
using System.Data;


namespace Funnel.Logic.Utils.Asistentes
{
    public class AsistenteHistorico
    {
        private static readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        private readonly string _connectionString;
        public AsistenteHistorico(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }

        public async Task<ConsultaAsistente> AsistenteOpenAIAsync(ConsultaAsistente consultaAsistente)
        {
            if (string.IsNullOrWhiteSpace(consultaAsistente.Pregunta))
            {
                consultaAsistente.Respuesta = "Por favor proporciona una pregunta válida.";
                return consultaAsistente;
            }

            try
            {

                var respuestaOpenIA = await BuildAnswer(consultaAsistente.Pregunta);

                consultaAsistente.Respuesta = respuestaOpenIA.Respuesta;
                consultaAsistente.TokensEntrada = respuestaOpenIA.TokensEntrada;
                consultaAsistente.TokensSalida = respuestaOpenIA.TokensSalida;
                consultaAsistente.Exitoso = true;
                consultaAsistente.FechaRespuesta = DateTime.Now;
            }
            catch (Exception ex)
            {
                consultaAsistente.Exitoso = false;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                consultaAsistente.Respuesta = "Ocurrió un error al procesar la pregunta: " + ex.Message;
            }

            return consultaAsistente;
        }

        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta)
        {
            RespuestaOpenIA respuestaOpenIA = new();

            var systemMessage = $@"
            Eres un asistente experto en análisis de oportunidades de negocio. Tu tarea es analizar oportunidades comerciales a partir de su historial de seguimientos.

            ### INSTRUCCIONES:

            1. **Analiza el historial de seguimientos.**
               - Si hay **menos de 3 seguimientos en el historial**:
                 - NO generes un análisis completo.
                 - Escribe un mensaje indicando que se requiere mayor detalle y más registros.
                 - Muestra **solo una visión general breve de máximo 50 palabras.**
                 - Evalúa la **inactividad solo como negativa si han pasado más de 10 días** desde el último seguimiento. Si no, no la menciones como problema.

            2. **Si hay 5 o más seguimientos**, incluso si algunos reflejan falta de respuesta o acciones no concluyentes, considera como válidos:
               - Intentos de contacto.
               - Seguimientos reiterados.
               - Comentarios sobre falta de respuesta, presupuesto o reestructuración.
               - Referencias a actores clave, decisiones o barreras internas.
               - Si se cumplen estas condiciones, genera lo siguiente:
                 - <b>Visión general:</b> máximo 60 palabras.
                 - <b>Análisis de sentimiento:</b> máximo 100 palabras.
                 - <b>Análisis de actuación de los ejecutivos:</b> máximo 50 palabras.
                 - <b>Consejos para el manejo de la cuenta:</b> máximo 80 palabras, en formato de lista basada en el análisis del comportamiento de los ejecutivos.

            3. Siempre responde en **formato HTML**, con estructura clara y visualmente ordenada.

            4. Considera como **relevantes** los seguimientos que incluyan:
               - Acciones concretas (incluso si son negativas).
               - Ajustes a la propuesta.
               - Sesiones agendadas o realizadas.
               - Comunicaciones y respuestas clave con el cliente (positivas o negativas).
               - Comentarios sobre entregables, decisiones o validaciones.
               - Menciones de actores importantes (ej. ITESM, EISEI, Ana Karen).
               - Intentos de contacto con actores clave, seguimiento sin respuesta, reorganización interna, falta de presupuesto.

            5. Considera la **fecha del último seguimiento** para evaluar la inactividad:
               - Si han pasado más de 10 días sin actividad, indícalo como un punto negativo.
               - Si han pasado 10 días o menos, **no lo menciones como un problema**.

            <!-- Hay más de 5 seguimientos relevantes, con acciones e interacciones de seguimiento claras -->

            ### EJEMPLO DE SALIDA SI LOS DATOS SON INSUFICIENTES:
 
            <b>Visión general:</b>
            <p>El seguimiento actual es limitado y no permite realizar un análisis completo de la oportunidad.</p>
 
            <p><i>Se recomienda registrar más seguimientos y redactar observaciones detalladas que reflejen acciones concretas y avances reales.</i></p>
 
            ### CONTENIDO DE ENTRADA:
            <pregunta>
            {pregunta}
            </pregunta>
            ";


            var messages = new List<Message>
            {
                new Message { role = "system", content = systemMessage }
            };

            List<ConfiguracionDto> result = new List<ConfiguracionDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
             
                DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, 1)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_ConfiguracionAsistentesPorIdBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ConfiguracionDto();
                    dto.Modelo = ComprobarNulos.CheckStringNull(reader["Modelo"]);
                    dto.Llave = ComprobarNulos.CheckStringNull(reader["Llave"]);
                    result.Add(dto);
                }
            }
            var modelo = result.FirstOrDefault()?.Modelo;
            var llave = result.FirstOrDefault()?.Llave;

            var requestBody = new ChatRequestBody
            {
                model = modelo,
                messages = messages,
                temperature = 0.7,
                max_tokens = 500
            };

            var chatRespuestaOpenIA = await OpenIAFunciones.ChatCompletionAsync(llave, requestBody);
            respuestaOpenIA.Respuesta = chatRespuestaOpenIA.choices[0].message.content.Trim();
            respuestaOpenIA.TokensEntrada = chatRespuestaOpenIA.usage.prompt_tokens;
            respuestaOpenIA.TokensSalida = chatRespuestaOpenIA.usage.total_tokens;

            return respuestaOpenIA;
        }
    }
}

