using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Markdig;
using System.Threading.Tasks;
using static Funnel.Logic.AsistentesService;
using Funnel.Models.Dto;
using Microsoft.Identity.Client;
using Funnel.Models.Base;
using DinkToPdf.Contracts;

namespace Funnel.Logic.Utils
{
    public static class OpenAIUtils
    {
        public static HttpClient GetClient(string apiKey)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            //client.DefaultRequestHeaders.Add("OpenAI-Beta", "assistants=v2");
            return client;
        }

        public static async Task<string> CreateAssistantWithVectorStoreAsync(string apiKey, string model, string prompt, string vectorStoreId)
        {
            var client = GetClient(apiKey);
            var body = new
            {
                model = model,
                instructions = prompt,
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
            var body = new { role, content };
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

        public static async Task<string> CreateVectorStoreAsync(string apiKey, string fileId)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.openai.com/v1/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new { file_ids = new[] { fileId } };
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

        public static string LimpiarRespuesta(string markdown)
        {
            var normalizado = markdown.Replace("\r\n", "\n").Replace("\r", "\n");
            normalizado = Regex.Replace(normalizado, @"\*\*(.+?)\*\*", "<strong>$1</strong>");
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

        // ===============================================
        // MÉTODOS PARA LA NUEVA API DE CONVERSACIONES
        // ===============================================

        public static async Task<string> CreateConversationAsync(string apiKey, int idUsuario, string prompt)
        {
            var client = GetClient(apiKey);
            
            var body = new
            {
                items = new[] { new { role = "assistant", content = prompt } },
                metadata = new { user_id = "Bruno_" + idUsuario.ToString() }
            };
            
            var jsonRequest = JsonSerializer.Serialize(body);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync("conversations", content);
            //response.EnsureSuccessStatusCode();
            
            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);
            
            if (!doc.RootElement.TryGetProperty("id", out var idElement))
                throw new InvalidOperationException("La respuesta de OpenAI no contiene la propiedad 'id'. Respuesta: " + jsonResponse);
                
            return idElement.GetString() ?? throw new InvalidOperationException("El ID de la conversación es nulo");
        }

        public static async Task<BaseOut> SendMessageToConversationAsync(string apiKey, string conversationId, string message, string role = "assistant")
        {
            try
            {
                var client = GetClient(apiKey);

                var body = new
                {
                    model = "gpt-5-mini",
                    conversation = conversationId,
                    input = new[] { new { role = role, content = message } }
                };

                var jsonRequest = JsonSerializer.Serialize(body);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("responses", content);
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(jsonResponse);

                return new BaseOut
                {
                    Result = doc.RootElement.TryGetProperty("output", out var outputArray) && outputArray.GetArrayLength() > 0,
                    ErrorMessage = ""
                };
            }
            catch(Exception ex)
            {
                return new BaseOut
                {
                    Result = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public static async Task<ConversationResponse> GetRespuestaConversacionAsync(string apiKey, string conversationId, string message, string vectorStoreId)
        {
            var client = GetClient(apiKey);

            var body = new
            {
                model = "gpt-5-mini",
                conversation = conversationId,
                input = new[] { new { role = "user", content = message } },
                tools = new[] { new {
                      type = "file_search",
                      vector_store_ids = new[] { vectorStoreId },
                      max_num_results = 20
                    }
                }
            };

            var jsonRequest = JsonSerializer.Serialize(body);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("responses", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);

            var responseContent = "";
            var tokensUsed = 0;
            var inputTokens = 0;
            var outputTokens = 0;

            // Extraer el contenido del texto desde output[0].content[0].text
            if (doc.RootElement.TryGetProperty("output", out var outputArray) && outputArray.GetArrayLength() > 1)
            {
                var firstOutput = outputArray[1];
                if (firstOutput.TryGetProperty("content", out var contentArray) && contentArray.GetArrayLength() > 0)
                {
                    var firstContent = contentArray[0];
                    if (firstContent.TryGetProperty("text", out var textElement))
                    {
                        responseContent = textElement.GetString() ?? "";
                    }
                }
            }

            // Extraer información de tokens si está disponible
            if (doc.RootElement.TryGetProperty("usage", out var usage))
            {
                if (usage.TryGetProperty("prompt_tokens", out var promptTokens))
                    inputTokens = promptTokens.GetInt32();
                if (usage.TryGetProperty("completion_tokens", out var completionTokens))
                    outputTokens = completionTokens.GetInt32();
                if (usage.TryGetProperty("total_tokens", out var totalTokens))
                    tokensUsed = totalTokens.GetInt32();
            }

            return new ConversationResponse
            {
                Content = LimpiarRespuesta(responseContent),
                InputTokens = inputTokens,
                OutputTokens = outputTokens,
                TotalTokens = tokensUsed,
                ConversationId = conversationId
            };
        }

        public static async Task<List<ConversationMessage>> GetConversationHistoryAsync(string apiKey, string conversationId)
        {
            var client = GetClient(apiKey);
            
            var response = await client.GetAsync($"conversations/{conversationId}/messages");
            response.EnsureSuccessStatusCode();
            
            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);
            
            var messages = new List<ConversationMessage>();
            
            if (doc.RootElement.TryGetProperty("messages", out var messagesArray))
            {
                foreach (var message in messagesArray.EnumerateArray())
                {
                    messages.Add(new ConversationMessage
                    {
                        Role = message.GetProperty("role").GetString() ?? "",
                        Content = message.GetProperty("content").GetString() ?? "",
                        Timestamp = message.TryGetProperty("timestamp", out var ts) ? 
                                   DateTime.Parse(ts.GetString() ?? DateTime.Now.ToString(), System.Globalization.CultureInfo.InvariantCulture) : DateTime.Now
                    });
                }
            }
            
            return messages;
        }
    }
}
