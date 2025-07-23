using Funnel.Logic.Interfaces;
using Funnel.Models.Base;
using Funnel.Models.Dto;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using Funnel.Data.Interfaces;
using SharpToken;
using Markdig;
using System.Text.RegularExpressions;
namespace Funnel.Logic
{
    public class AsistentesService: IAsistentesService
    {
        private readonly IMemoryCache _cache;
        private readonly IAsistentesData _asistentesData;
        public AsistentesService(IConfiguration configuration, IMemoryCache cache, IAsistentesData asistentesData)
        {
            _cache = cache;
            _asistentesData = asistentesData;
        }
        private string GetVectorStoreCacheKey(int idBot) => $"vectorStoreId_{idBot}";
        private string GetAssistantCacheKey(int userId, int idBot) => $"assistantId_{userId}_{idBot}";
        private string GetThreadCacheKey(int userId, int idBot) => $"threadId_{userId}_{idBot}";


        public async Task<BaseOut> ActualizarDocumento(ConsultaAsistente consultaAsistente)
        {
            BaseOut result = new BaseOut();
            var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(consultaAsistente.IdBot);
            if (configuracion == null)
                throw new Exception("No se encontró configuración para el asistente ");

            string filePath = Directory.GetCurrentDirectory() + configuracion.RutaDocumento;
            string file_id = await UploadFileToOpenAIAsync(configuracion.Llave, filePath, "assistants");

            result = await _asistentesData.GuardarFileIdLeadEisei(consultaAsistente.IdBot, file_id);

            return result;
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
                var respuestaOpenIA = await BuildAnswer(consultaAsistente.Pregunta, consultaAsistente.IdBot, consultaAsistente.IdUsuario);
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
        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, int idBot, int idUsuario)
        {
            try
            {
                var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(idBot);
                if (configuracion == null)
                    throw new Exception("No se encontró configuración para el asistente con IdBot: " + idBot);
                
                if (string.IsNullOrEmpty(configuracion.FileId))
                {
                    string filePath = Directory.GetCurrentDirectory() + configuracion.RutaDocumento;
                    configuracion.FileId = await UploadFileToOpenAIAsync(configuracion.Llave, filePath);
                    await _asistentesData.GuardarFileIdLeadEisei(idBot, configuracion.FileId);
                }

                string vectorStoreId = await GetOrCreateVectorStoreIdAsync(configuracion.Llave, idBot, configuracion.FileId);

                // 1. Crear el assistant con el prompt como instrucciones
                var assistantId = await GetOrCreateAssistantIdAsync(configuracion, idUsuario, vectorStoreId, idBot);

                //2. Crear un thread
                var threadId = await GetOrCreateThreadIdAsync(configuracion.Llave, idUsuario, idBot);

                // 3. Agregar el mensaje del usuario
                await AddMessageToThreadAsync(configuracion.Llave, threadId, pregunta, "user");

                // 4. Ejecutar el assistant sobre el thread
                var runId = await RunAssistantAsync(configuracion.Llave, assistantId, threadId, vectorStoreId);

                // 5. Esperar la respuesta
                //var respuesta = await GetAssistantResponseAsync(configuracion.Llave, threadId, runId);
                //var usage = await GetRunUsageAsync(configuracion.Llave, threadId, runId);

                var respuesta = await GetAssistantResponseAsync(configuracion.Llave, threadId, runId);
                // 6. Contar los tokens
                var tokensEntrada = ContarTokens(pregunta, configuracion.Modelo);
                var tokensSalida = ContarTokens(respuesta.Content, configuracion.Modelo);
                var insertarBitacora = new InsertaBitacoraPreguntasDto
                {
                    IdBot = idBot,
                    Pregunta = pregunta,
                    FechaPregunta = DateTime.Now,
                    Respuesta = respuesta.Content,
                    FechaRespuesta = DateTime.Now,
                    Respondio = true,
                    TokensEntrada = tokensEntrada,
                    TokensSalida = tokensSalida,
                    IdUsuario = idUsuario,
                    CostoPregunta = tokensEntrada * configuracion.CostoTokensEntrada,
                    CostoRespuesta = tokensSalida * configuracion.CostoTokensSalida,
                    CostoTotal = (tokensEntrada * configuracion.CostoTokensEntrada) + (tokensSalida * configuracion.CostoTokensSalida),
                    Modelo = configuracion.Modelo
                };
                await _asistentesData.InsertaPreguntaBitacoraPreguntas(insertarBitacora);
                return new RespuestaOpenIA
                {
                    Respuesta = respuesta.Content,
                    TokensEntrada = tokensEntrada,
                    TokensSalida = tokensSalida
                };
            }
            catch (Exception ex)
            {
                return new RespuestaOpenIA
                {
                    Respuesta = ex.Message,
                    TokensEntrada = 0,
                    TokensSalida = 0
                };
            }
        }

        
        private static HttpClient GetClient(string apiKey)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.DefaultRequestHeaders.Add("OpenAI-Beta", "assistants=v2");
            return client;
        }
        public static async Task<string> CreateAssistantWithVectorStoreAsync(ConfiguracionDto configuracion, string vectorStoreId)
        {
            var client = GetClient(configuracion.Llave);
            var body = new
            {
                model = configuracion.Modelo,
                instructions = configuracion.Prompt,
                name = "AsistenteProspeccionInteligente",
                temperature = 0.5,
                tools = new[] { new { type = "file_search" } }
            };
            var jsonRequest = JsonSerializer.Serialize(body);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("assistants", content);
            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);
            if (!doc.RootElement.TryGetProperty("id", out var idElement))
                throw new Exception("La respuesta de OpenAI no contiene la propiedad 'id'. Respuesta: " + jsonResponse);
            return idElement.GetString();
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

        public static async Task<string> RunAssistantAsync(string apiKey, string assistantId, string threadId, string vectorStoreId)
        {
            var client = GetClient(apiKey);
            var body = new
            {
                assistant_id = assistantId,
                tool_resources = new
                {
                    file_search = new
                    {
                        vector_store_ids = new[] { vectorStoreId }
                    }
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await client.PostAsync($"threads/{threadId}/runs", content);
            var json = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
                throw new Exception($"Error al ejecutar el run: {response.StatusCode} - {json}");
            using var doc = JsonDocument.Parse(json);
            if (!doc.RootElement.TryGetProperty("id", out var idElement))
                throw new Exception("La respuesta de OpenAI no contiene la propiedad 'id'. Respuesta: " + json);
            return idElement.GetString();
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
            int maxWaitMs = 30000; 
            int waited = 0;
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

                    var respuestaLimpia = LimpiarRespuesta(content);
                    return new AssistantResponse
                    {
                        Content = respuestaLimpia,
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
        public static string LimpiarRespuesta(string markdown)
        {
            var normalizado = NormalizarSaltosDeLinea(markdown);
            normalizado = normalizado.Replace("\n\n", "\n\n");
            normalizado = ReemplazarNegritas(normalizado);
            var html = Markdig.Markdown.ToHtml(normalizado);

            return html;
        }
        private static string NormalizarSaltosDeLinea(string markdown)
        {
            // Reemplaza \r\n y \r por \n
            return markdown.Replace("\r\n", "\n").Replace("\r", "\n");
        }
        private static string ReemplazarNegritas(string texto)
        {
            // Reemplaza **texto** por <strong>texto</strong>
            return Regex.Replace(texto, @"\*\*(.+?)\*\*", "<strong>$1</strong>");
        }
        private async Task<string> GetOrCreateAssistantIdAsync(ConfiguracionDto configuracion, int userId, string vectorStoreId, int idBot)
        {
            var assistantId = await _cache.GetOrCreateAsync(GetAssistantCacheKey(userId, idBot), async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(8);
                var id = await CreateAssistantWithVectorStoreAsync(configuracion, vectorStoreId);
                return id ?? throw new InvalidOperationException("El ID del asistente no puede ser nulo.");
            });

            if (assistantId is null)
                throw new InvalidOperationException("El ID del asistente no puede ser nulo (cache).");

            return assistantId;
        }
        private async Task<string> GetOrCreateThreadIdAsync(string apiKey, int userId, int idBot)
        {
            var threadId = await _cache.GetOrCreateAsync(GetThreadCacheKey(userId, idBot), async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2);
                var id = await CreateThreadAsync(apiKey);
                return id ?? throw new InvalidOperationException("El ID del thread no puede ser nulo.");
            });

            if (threadId is null)
                throw new InvalidOperationException("El ID del thread no puede ser nulo (cache).");

            return threadId;
        }
        private async Task<string> GetOrCreateVectorStoreIdAsync(string apiKey, int idBot, string fileId)
        {
            var vectorStoreId = await _cache.GetOrCreateAsync(GetVectorStoreCacheKey(idBot), async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7);   
                var id = await CreateVectorStoreAsync(apiKey, fileId);
                // Espera a que el Vector Store esté listo  
                while (!await IsVectorStoreReadyAsync(apiKey, id))
                {
                    await Task.Delay(1000);
                }
                return id ?? throw new InvalidOperationException("El ID del Vector Store no puede ser nulo.");
            });

            if (vectorStoreId is null)
                throw new InvalidOperationException("El ID del Vector Store no puede ser nulo (cache).");

            return vectorStoreId;
        }
        public static async Task<string> UploadFileToOpenAIAsync(string apiKey, string filePath, string purpose = "assistants")
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            using var form = new MultipartFormDataContent();
            using var fileStream = File.OpenRead(filePath);
            var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            form.Add(fileContent, "file", Path.GetFileName(filePath));
            form.Add(new StringContent(purpose), "purpose");

            var response = await client.PostAsync("files", form);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("id").GetString();
        }
        public static async Task AddFileToThreadAsync(string apiKey, string threadId, string fileId)
        {
            var client = GetClient(apiKey);
            var body = new
            {
                file_id = fileId
            };
            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await client.PostAsync($"threads/{threadId}/files", content);
            response.EnsureSuccessStatusCode();
        }
        public static async Task<string> CreateVectorStoreAsync(string apiKey, string fileId)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new
            {
                file_ids = new[] { fileId }
            };
            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("vector_stores", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("id").GetString();
        }
        public static async Task<bool> IsVectorStoreReadyAsync(string apiKey, string vectorStoreId)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var response = await client.GetAsync($"vector_stores/{vectorStoreId}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var status = doc.RootElement.GetProperty("status").GetString();
            return status == "completed";
        }
        public class RunUsage
        {
            public int PromptTokens { get; set; }
            public int CompletionTokens { get; set; }
            public int TotalTokens { get; set; }
        }

        public static async Task<RunUsage> GetRunUsageAsync(string apiKey, string threadId, string runId)
        {
            var client = GetClient(apiKey);
            var response = await client.GetAsync($"threads/{threadId}/runs/{runId}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty("usage", out var usage))
            {
                return new RunUsage
                {
                    PromptTokens = usage.GetProperty("prompt_tokens").GetInt32(),
                    CompletionTokens = usage.GetProperty("completion_tokens").GetInt32(),
                    TotalTokens = usage.GetProperty("total_tokens").GetInt32()
                };
            }
            return new RunUsage();
        }
        private static int ContarTokens(string texto, string modelo)
        {
            try
            {
                var encoding = GptEncoding.GetEncodingForModel(modelo);
                return encoding.Encode(texto).Count;
            }
            catch
            {
                var encoding = GptEncoding.GetEncoding("cl100k_base");
                return encoding.Encode(texto).Count;
            }
        }
        public async Task LimpiarCacheAsistente(int userId, int idBot)
        {
            await Task.Run(() =>
            {
                RemoveAssistantCache(userId, idBot);
                RemoveThreadCache(userId, idBot);
                RemoveVectorStoreCache(idBot);
            });
        }

        public void RemoveAssistantCache(int userId, int idBot)
        {
            _cache.Remove(GetAssistantCacheKey(userId, idBot));
        }

        public void RemoveThreadCache(int userId, int idBot)
        {
            _cache.Remove(GetThreadCacheKey(userId, idBot));
        }

        public void RemoveVectorStoreCache(int idBot)
        {
            _cache.Remove(GetVectorStoreCacheKey(idBot));
        }

    }
}
