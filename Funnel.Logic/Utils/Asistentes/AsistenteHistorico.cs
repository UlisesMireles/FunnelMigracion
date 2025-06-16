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
            Eres un asistente experto en análisis de oportunidades de negocio. Tu tarea es evaluar oportunidades comerciales a partir de su historial de seguimientos.

            ### FORMATO DE RESPUESTA:
            Responde siempre en formato HTML, con estructura clara, visualmente ordenada y fácil de leer.
            **No generes títulos ni repitas la informacion que se proporciona de la oportunidad** (usa solo subtítulos en negritas o párrafos si es necesario).

            ---

            ### REGLAS DE EVALUACIÓN:

            1. **Número mínimo de seguimientos para análisis completo:**
               - Si hay **5 o más seguimientos** y al menos **4 son relevantes**, haz el análisis completo.
               - De lo contrario, da solo una visión general breve (máx. 50 palabras) y menciona que se requiere más información.

            2. **Qué es un seguimiento relevante:**
               Considera como relevante cualquier seguimiento que incluya al menos una de estas características:
               - Acciones concretas (envío de correos, llamadas, seguimiento directo, etc.).
               - Ajustes o solicitudes específicas del cliente.
               - Envío de documentos, presentaciones o propuestas.
               - Menciones de reuniones, sesiones, o validación con actores clave.
               - Cualquier forma de contacto activo, incluso sin respuesta.
               - Comentarios sobre falta de respuesta, reorganización interna, presupuestos o validación de documentos.

               **NO descartes seguimientos solo porque estén escritos de forma breve. Si hay intención o acción, considéralo relevante.**

            3. **Análisis completo debe incluir:**
               - <b>Visión general:</b> máximo 60 palabras.
               - <b>Análisis de sentimiento:</b> máximo 100 palabras.
               - <b>Análisis de actuación de los ejecutivos:</b> máximo 50 palabras.
               - <b>Consejos para el manejo de la cuenta:</b> máximo 80 palabras, en lista.

            4. **Inactividad:**
               - Si han pasado más de 15 días sin actividad, incluye esta línea textual:

                 <span style=""font-size: 16px; font-weight: bold;"">Se solicita actualizar este seguimiento dado que tiene más de 15 días sin actividad.</span>

            5. **Monto y etapa:**
               - Si el monto es menor a $100 y la etapa es 1, menciónalo como oportunidad de bajo impacto salvo que haya evolución.
               - Si está estancada en etapa 1 por mucho tiempo sin avance, sugerir su cierre.

            ---

            ### EJEMPLO DE SALIDA SI HAY MENOS DE 4 SEGUIMIENTO:

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
                max_tokens = 700
            };

            var chatRespuestaOpenIA = await OpenIAFunciones.ChatCompletionAsync(llave, requestBody);
            respuestaOpenIA.Respuesta = chatRespuestaOpenIA.choices[0].message.content.Trim();
            respuestaOpenIA.TokensEntrada = chatRespuestaOpenIA.usage.prompt_tokens;
            respuestaOpenIA.TokensSalida = chatRespuestaOpenIA.usage.total_tokens;

            return respuestaOpenIA;
        }
    }
}

