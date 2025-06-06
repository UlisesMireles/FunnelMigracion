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
            Eres un asistente experto en análisis de oportunidades de negocio.

            Recibirás información de una oportunidad junto con su historial de seguimientos.

            ### INSTRUCCIONES:

            1. Analiza el historial de seguimientos.
               - Si hay **menos de 5 seguimientos**, o
               - Si los seguimientos son **muy cortos o sin información relevante** (por ejemplo, frases como “es una prueba”, “modificado calendario”, “seguimiento simple”, etc.):
                 - NO generes el análisis completo.
                 - En su lugar, escribe un mensaje indicando que se requiere mayor detalle y más registros.
                 - Solo muestra **una breve visión general de 50 palabras o menos.**
                 - Toma en cuenta la fecha sin actividad para sugerir acciones a seguir.

            2. Si el historial **sí tiene 5 o más seguimientos y con contenido relevante**:
               - Genera:
                 - <b>Visión general:</b> (60 palabras máx)
                 - <b>Análisis de sentimiento:</b> (100 palabras máx)
                 - <b>Análisis de actuación de los ejecutivos:</b> (50 palabras máx)
                 - <b>Consejos para el manejo de la cuenta:</b> (80 palabras máx y en una lista en base a el analisis de ejecutivos)

            3. Siempre responde en **formato HTML**, estructurado y fácil de leer visualmente.

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

