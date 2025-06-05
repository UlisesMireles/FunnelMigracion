using Funnel.Models.Dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using static Funnel.Models.Dto.OpenAiConfiguracion;

namespace Funnel.Data.Utils
{
    public class OpenIAFunciones
    {
        private static readonly HttpClient client = new HttpClient();

        public static async Task<OpenAiChatRespuesta> ChatCompletionAsync(string apiKey, ChatRequestBody requestBody)
        {
            OpenAiChatRespuesta respuestaOpenIA = new();
            try
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
                var content = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();

                    OpenAiChatRespuesta? result = JsonConvert.DeserializeObject<OpenAiChatRespuesta>(jsonResponse);

                    if (result == null)
                    {
                        return respuestaOpenIA;
                    }
                    respuestaOpenIA = result;

                }

                return respuestaOpenIA;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return respuestaOpenIA;
                throw;
            }
        }

        public static async Task<RespuestaOpenIA> ConvertPromptToVectorAsync(string text, string apiKey)
        {
            RespuestaOpenIA respuestaOpenIA = new();
            try
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                var requestBody = new
                {
                    model = "text-embedding-ada-002", // Modelo para obtener embeddings
                    input = text
                };

                var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
                var content = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("https://api.openai.com/v1/embeddings", content);
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                dynamic? result = JsonConvert.DeserializeObject(jsonResponse);

                respuestaOpenIA.PreguntaVector = result.data[0].embedding.ToObject<float[]>();
                respuestaOpenIA.TokensEntrada = (int)result.usage.prompt_tokens;
                respuestaOpenIA.TokensSalida = (int)result.usage.total_tokens;
                return respuestaOpenIA;
            }
            catch (Exception e)
            {
                respuestaOpenIA.Respuesta = e.Message;
                return respuestaOpenIA;
                throw;
            }

        }
    }
}

