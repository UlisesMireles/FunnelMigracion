using Funnel.Models.Base;
using Funnel.Models.Dto;
using System.Text;
using System.Text.Json;
namespace Funnel.Logic.Utils.Asistentes
{
    public class AssstantApiUtils
    {
        public static async Task<string> CreateConversationAsync(string apiKey, int idUsuario, string prompt)
        {
            var client = OpenAIUtils.GetClient(apiKey);

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
                var client = OpenAIUtils.GetClient(apiKey);

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
            catch (Exception ex)
            {
                return new BaseOut
                {
                    Result = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public static async Task<ConversationResponse> GetRespuestaConversacionAsync(ConfiguracionDto configuracion, string conversationId, string message, string vectorStoreId)
        {
            var client = OpenAIUtils.GetClient(configuracion.Llave);

            var body = new
            {
                model = configuracion.Modelo,
                conversation = conversationId,
                input = new[] { new { role = "user", content = message } }
                //,tools = new[] { new {
                //      type = "file_search",
                //      vector_store_ids = new[] { vectorStoreId },
                //      max_num_results = 20
                //    }
                //}
            };

            var jsonRequest = JsonSerializer.Serialize(body);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("responses", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);

            var responseContent = "";
            var tokensUsed = 0;
            var cacheTokens = 0;
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
                if (usage.TryGetProperty("input_tokens", out var promptTokens))
                    inputTokens = promptTokens.GetInt32();
                if (usage.TryGetProperty("output_tokens", out var completionTokens))
                    outputTokens = completionTokens.GetInt32();
                if (usage.TryGetProperty("total_tokens", out var totalTokens))
                    tokensUsed = totalTokens.GetInt32();
                if (usage.TryGetProperty("input_tokens_details", out var detailsTokens))
                {
                    if (detailsTokens.TryGetProperty("cached_tokens", out var cacehTokens))
                        cacheTokens = cacehTokens.GetInt32();
                }
            }

            return new ConversationResponse
            {
                Content = OpenAIUtils.LimpiarRespuesta(responseContent),
                InputTokens = inputTokens - cacheTokens,
                OutputTokens = outputTokens,
                TotalTokens = tokensUsed,
                ConversationId = conversationId
            };
        }

        public static async Task<List<ConversationMessage>> GetConversationHistoryAsync(string apiKey, string conversationId)
        {
            var client = OpenAIUtils.GetClient(apiKey);

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
        public static async Task<ConversationResponse> CallResponsesApiAsync(string apiKey, string model, string instructions, string userMessage)
        {
            var client = OpenAIUtils.GetClient(apiKey);

            var requestBody = new
            {
                model,
                instructions,
                input = new[] { new { role = "user", content = userMessage } },
            };

            var jsonRequest = JsonSerializer.Serialize(requestBody);
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
                if (usage.TryGetProperty("input_tokens", out var promptTokens))
                    inputTokens = promptTokens.GetInt32();
                if (usage.TryGetProperty("output_tokens", out var completionTokens))
                    outputTokens = completionTokens.GetInt32();
                if (usage.TryGetProperty("total_tokens", out var totalTokens))
                    tokensUsed = totalTokens.GetInt32();
            }

            return new ConversationResponse
            {
                Content = OpenAIUtils.LimpiarRespuesta(responseContent),
                InputTokens = inputTokens,
                OutputTokens = outputTokens,
                TotalTokens = tokensUsed,
                ConversationId = ""
            };
        }
    }
}
