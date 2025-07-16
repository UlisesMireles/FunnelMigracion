using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using static Funnel.Models.Dto.OpenAiConfiguracion;

namespace Funnel.Logic.Utils.Asistentes
{
    public class AsistenteProspeccionInteligente
    {
        private static readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        private readonly string _connectionString;
        public AsistenteProspeccionInteligente(IConfiguration configuration)
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

                var respuestaOpenIA = await BuildAnswer(consultaAsistente.Pregunta, consultaAsistente.IdBot);

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

        private async Task<ConfiguracionDto?> ObtenerConfiguracionPorIdBotAsync(int idBot)
        {
            List<ConfiguracionDto> result = new List<ConfiguracionDto>();
            IList<ParameterSQl> list = new List<ParameterSQl>
            {
                DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot)
            };
            using (IDataReader reader = await DataBase.GetReaderSql("F_ConfiguracionAsistentesPorIdBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new ConfiguracionDto();
                    dto.Modelo = ComprobarNulos.CheckStringNull(reader["Modelo"]);
                    dto.Llave = ComprobarNulos.CheckStringNull(reader["Llave"]);
                    dto.Prompt = ComprobarNulos.CheckStringNull(reader["Prompt"]);
                    result.Add(dto);
                }
            }
            return result.FirstOrDefault();
        }

        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, int idBot)
        {
            var configuracion = await ObtenerConfiguracionPorIdBotAsync(idBot);
            if (configuracion == null)
                throw new Exception("No se encontró configuración para el asistente con IdBot: " + idBot);

            // 1. Crear el assistant con el prompt como instrucciones
            var assistantId = await CreateAssistantAsync(
                apiKey: configuracion.Llave,
                model: configuracion.Modelo,
                instructions: configuracion.Prompt
            );

            // 2. Crear un thread
            var threadId = await CreateThreadAsync(configuracion.Llave);

            // 3. Agregar el mensaje del usuario
            await AddMessageToThreadAsync(configuracion.Llave, threadId, pregunta, "user");

            // 4. Ejecutar el assistant sobre el thread
            var runId = await RunAssistantAsync(configuracion.Llave, assistantId, threadId);

            // 5. Esperar la respuesta
            var respuesta = await GetAssistantResponseAsync(configuracion.Llave, threadId, runId);

            return new RespuestaOpenIA
            {
                Respuesta = respuesta.Content,
                TokensEntrada = respuesta.PromptTokens,
                TokensSalida = respuesta.CompletionTokens
            };
        }
        private static HttpClient GetClient(string apiKey)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.DefaultRequestHeaders.Add("OpenAI-Beta", "assistants=v2");
            return client;
        }
        public static async Task<string> CreateAssistantAsync(string apiKey, string model, string instructions)
        {
            var client = GetClient(apiKey);
            model = "gpt-4-1106-preview";
            var body = new
            {
                model,
                instructions,
                name = "AsistenteProspeccionInteligente"
            };
            var jsonRequest = JsonSerializer.Serialize(body);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("assistants", content);
            //if (!response.IsSuccessStatusCode)
            //{
            //    var errorContent = await response.Content.ReadAsStringAsync();
            //    throw new Exception($"Error al crear el assistant: {response.StatusCode} - {errorContent}");
            //}
            var jsonResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Status: {response.StatusCode}\nBody: {jsonResponse}");
            using var doc = JsonDocument.Parse(jsonResponse);
            return doc.RootElement.GetProperty("id").GetString();
        }
        public static async Task<string> CreateThreadAsync(string apiKey)
        {
            var client = GetClient(apiKey);
            var response = await client.PostAsync("threads", new StringContent("{}", Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("id").GetString();
        }

        public static async Task AddMessageToThreadAsync(string apiKey, string threadId, string content, string role)
        {
            var client = GetClient(apiKey);
            var body = new
            {
                role,
                content
            };
            var response = await client.PostAsync($"threads/{threadId}/messages", new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
        }

        public static async Task<string> RunAssistantAsync(string apiKey, string assistantId, string threadId)
        {
            var client = GetClient(apiKey);
            var body = new
            {
                assistant_id = assistantId
            };
            var response = await client.PostAsync($"threads/{threadId}/runs", new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("id").GetString();
        }

        public class AssistantResponse
        {
            public string Content { get; set; }
            public int PromptTokens { get; set; }
            public int CompletionTokens { get; set; }
        }

        public static async Task<AssistantResponse> GetAssistantResponseAsync(string apiKey, string threadId, string runId)
        {
            var client = GetClient(apiKey);

            // Esperar a que el run termine (polling)
            string status = "";
            do
            {
                await Task.Delay(1000);
                var runResponse = await client.GetAsync($"threads/{threadId}/runs/{runId}");
                runResponse.EnsureSuccessStatusCode();
                var runJson = await runResponse.Content.ReadAsStringAsync();
                using var runDoc = JsonDocument.Parse(runJson);
                status = runDoc.RootElement.GetProperty("status").GetString();
            } while (status != "completed" && status != "failed" && status != "cancelled");

            // Obtener el mensaje de respuesta
            var messagesResponse = await client.GetAsync($"threads/{threadId}/messages");
            messagesResponse.EnsureSuccessStatusCode();
            var messagesJson = await messagesResponse.Content.ReadAsStringAsync();
            using var messagesDoc = JsonDocument.Parse(messagesJson);

            var messages = messagesDoc.RootElement.GetProperty("data");
            foreach (var message in messages.EnumerateArray())
            {
                if (message.GetProperty("role").GetString() == "assistant")
                {
                    var content = message.GetProperty("content")[0].GetProperty("text").GetProperty("value").GetString();
                    // Los tokens no están directamente disponibles, deberías calcularlos si es necesario
                    return new AssistantResponse
                    {
                        Content = content,
                        PromptTokens = 0,
                        CompletionTokens = 0
                    };
                }
            }
            return new AssistantResponse
            {
                Content = "No se encontró respuesta del assistant.",
                PromptTokens = 0,
                CompletionTokens = 0
            };
        }
    }
}
