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
using System.Text.RegularExpressions;
using Funnel.Logic.Utils;
using Funnel.Data.Utils;
using System.Data;
using FuzzySharp;
namespace Funnel.Logic
{
    public class AsistentesService: IAsistentesService
    {
        private readonly IMemoryCache _cache;
        private readonly IAsistentesData _asistentesData; 
        private readonly string _connectionString;
        public AsistentesService(IConfiguration configuration, IMemoryCache cache, IAsistentesData asistentesData)
        {
            _cache = cache;
            _asistentesData = asistentesData;
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        private string GetVectorStoreCacheKey(int idBot) => $"vectorStoreId_{idBot}";
        private string GetAssistantCacheKey(int userId, int idBot) => $"assistantId_{userId}_{idBot}";
        private string GetThreadCacheKey(int userId, int idBot) => $"threadId_{userId}_{idBot}";
        public async Task<BaseOut> InicializarCacheIdsAsync(int userId, int idBot)
        {
            BaseOut result = new BaseOut();
            try
            {
                var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(idBot);
                if (configuracion == null)
                    throw new Exception("No se encontró configuración para el asistente ");

                // 1. Vector Store
                var vectorStoreCacheKey = GetVectorStoreCacheKey(idBot);
                if (!(_cache.Get(vectorStoreCacheKey) is string vectorStoreId) || string.IsNullOrEmpty(vectorStoreId))
                {
                    vectorStoreId = await OpenAIUtils.CreateVectorStoreAsync(configuracion.Llave, configuracion.FileId);
                    while (!await OpenAIUtils.IsVectorStoreReadyAsync(configuracion.Llave, vectorStoreId))
                    {
                        await Task.Delay(1000);
                    }
                    _cache.Set(vectorStoreCacheKey, vectorStoreId, TimeSpan.FromDays(7));
                }

                // 2. Assistant
                var assistantCacheKey = GetAssistantCacheKey(userId, idBot);
                if (!(_cache.Get(assistantCacheKey) is string assistantId) || string.IsNullOrEmpty(assistantId))
                {
                    assistantId = await OpenAIUtils.CreateAssistantWithVectorStoreAsync(
                        configuracion.Llave,
                        configuracion.Modelo,
                        configuracion.Prompt,
                        vectorStoreId
                    );
                    _cache.Set(assistantCacheKey, assistantId, TimeSpan.FromHours(2));
                }

                // 3. Thread
                var threadCacheKey = GetThreadCacheKey(userId, idBot);
                if (!(_cache.Get(threadCacheKey) is string threadId) || string.IsNullOrEmpty(threadId))
                {
                    threadId = await OpenAIUtils.CreateThreadAsync(configuracion.Llave);
                    _cache.Set(threadCacheKey, threadId, TimeSpan.FromHours(2));
                }
                result.Result = true;
            }
            catch (Exception ex)
            {
                result.Result = false;
                result.ErrorMessage = "Ocurrió un error al inicializar cache: " + ex.Message;
            }
            return result;
        }


        public async Task<BaseOut> ActualizarDocumento(ConsultaAsistente consultaAsistente)
        {
            BaseOut result = new BaseOut();
            var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(consultaAsistente.IdBot);
            if (configuracion == null)
                throw new Exception("No se encontró configuración para el asistente ");

            string filePath = Directory.GetCurrentDirectory() + configuracion.RutaDocumento;
            string file_id = await OpenAIUtils.UploadFileToOpenAIAsync(configuracion.Llave, filePath, "assistants");

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
                var respuestaFrecuente = await VerificarPreguntaFrecuenteAsync(consultaAsistente.Pregunta, consultaAsistente.IdBot, consultaAsistente.IdUsuario);

                if (respuestaFrecuente != null)
                {
                    consultaAsistente.Respuesta = respuestaFrecuente.Respuesta;
                    consultaAsistente.EsPreguntaFrecuente = true;
                    consultaAsistente.Exitoso = true;
                    consultaAsistente.FechaRespuesta = DateTime.Now;

                    // Obtener configuración y thread
                    var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(consultaAsistente.IdBot);
                    var threadId = await GetOrCreateThreadIdAsync(configuracion.Llave, consultaAsistente.IdUsuario, consultaAsistente.IdBot);

                    // Agregar pregunta y respuesta
                    await OpenAIUtils.AddMessageToThreadAsync(configuracion.Llave, threadId, consultaAsistente.Pregunta, "user");
                    await OpenAIUtils.AddMessageToThreadAsync(configuracion.Llave, threadId, consultaAsistente.Respuesta, "assistant");
                }
                else
                {
                    {
                        string preguntaConData = string.Concat(consultaAsistente.Pregunta, "(usuario:", consultaAsistente.NombreUsuario, ",correo:", consultaAsistente.Correo, ", puesto:", consultaAsistente.Puesto, ",telefono:", consultaAsistente.NumeroTelefono, ')');
                        var respuestaOpenIA = await BuildAnswer(preguntaConData, consultaAsistente.IdBot, consultaAsistente.IdUsuario);
                        consultaAsistente.Respuesta = respuestaOpenIA.Respuesta;
                        consultaAsistente.TokensEntrada = respuestaOpenIA.TokensEntrada;
                        consultaAsistente.TokensSalida = respuestaOpenIA.TokensSalida;
                        consultaAsistente.Exitoso = true;
                        consultaAsistente.FechaRespuesta = DateTime.Now;
                    }
                }
            }
            catch (Exception ex)
            {
                consultaAsistente.Exitoso = false;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                consultaAsistente.Respuesta = "Ocurrió un error al procesar la pregunta: " + ex.Message;
            }

            return consultaAsistente;
        }
        private async Task<PreguntasFrecuentesDto> VerificarPreguntaFrecuenteAsync(string pregunta, int idBot, int idUsuario)
        {
            List<PreguntasFrecuentesDto> preguntasFrecuentes = await ObtenerPreguntasFrecuentesAsync(idBot);

            var preguntaNormalizada = NormalizarTexto(pregunta);

            var mejorCoincidencia = preguntasFrecuentes
                .Where(p => p.Activo)
                .Select(p => new
                {
                    Pregunta = p,
                    Score = Fuzz.Ratio(NormalizarTexto(p.Pregunta), preguntaNormalizada)
                })
                .OrderByDescending(x => x.Score)
                .FirstOrDefault();

            const int umbralSimilitud = 90;
            if (mejorCoincidencia != null && mejorCoincidencia.Score >= umbralSimilitud)
            {
                return mejorCoincidencia.Pregunta;
            }

            return null;
        }

        private string NormalizarTexto(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return string.Empty;

            return texto.Trim().ToLower();
        }
        public async Task<List<PreguntasFrecuentesDto>> ObtenerPreguntasFrecuentesAsync(int idBot)
        {
            List<PreguntasFrecuentesDto> result = new List<PreguntasFrecuentesDto>();

            IList<ParameterSQl> list = new List<ParameterSQl>
            {
            DataBase.CreateParameterSql("@IdBot", SqlDbType.Int, 0, ParameterDirection.Input, false, null, DataRowVersion.Default, idBot)
            };

            using (IDataReader reader = await DataBase.GetReaderSql("F_PreguntasFrecuentesActivasPorBot", CommandType.StoredProcedure, list, _connectionString))
            {
                while (reader.Read())
                {
                    var dto = new PreguntasFrecuentesDto
                    {
                        Id = ComprobarNulos.CheckIntNull(reader["Id"]),
                        IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]),
                        Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]),
                        Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]),
                        Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]),
                        Categoria = ComprobarNulos.CheckStringNull(reader["Categoria"])
                    };
                    result.Add(dto);
                }
            }

            return result;
        }
        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, int idBot, int idUsuario)
        {
            try
            {
                DateTime fechaPregunta = DateTime.Now;
                var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(idBot);
                if (configuracion == null)
                    throw new Exception("No se encontró configuración para el asistente con IdBot: " + idBot);
                
                if (string.IsNullOrEmpty(configuracion.FileId))
                {
                    string filePath = Directory.GetCurrentDirectory() + configuracion.RutaDocumento;
                    configuracion.FileId = await OpenAIUtils.UploadFileToOpenAIAsync(configuracion.Llave, filePath);
                    await _asistentesData.GuardarFileIdLeadEisei(idBot, configuracion.FileId);
                }

                string vectorStoreId = await GetOrCreateVectorStoreIdAsync(configuracion.Llave, idBot, configuracion.FileId);

                // 1. Crear el assistant con el prompt como instrucciones
                var assistantId = await GetOrCreateAssistantIdAsync(configuracion, idUsuario, vectorStoreId, idBot);

                //2. Crear un thread
                var threadId = await GetOrCreateThreadIdAsync(configuracion.Llave, idUsuario, idBot);

                // 3. Agregar el mensaje del usuario
                await OpenAIUtils.AddMessageToThreadAsync(configuracion.Llave, threadId, pregunta, "user");

                // 4. Ejecutar el assistant sobre el thread
                var runId = await OpenAIUtils.RunAssistantAsync(configuracion.Llave, assistantId, threadId, vectorStoreId);

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
                    FechaPregunta = fechaPregunta,
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

        public static async Task<AssistantResponse> GetAssistantResponseAsync(string apiKey, string threadId, string runId)
        {
            var client = OpenAIUtils.GetClient(apiKey);

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

                    var respuestaLimpia = OpenAIUtils.LimpiarRespuesta(content);
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
        
        private async Task<string> GetOrCreateAssistantIdAsync(ConfiguracionDto configuracion, int userId, string vectorStoreId, int idBot)
        {
            var cacheKey = GetAssistantCacheKey(userId, idBot);
            if (_cache.Get(cacheKey) is string assistantId && !string.IsNullOrEmpty(assistantId))
            {
                return assistantId;
            }

            var newAssistantId = await OpenAIUtils.CreateAssistantWithVectorStoreAsync(
                configuracion.Llave,
                configuracion.Modelo,
                configuracion.Prompt,
                vectorStoreId
            );
            if (string.IsNullOrEmpty(newAssistantId))
                throw new InvalidOperationException("El ID del asistente no puede ser nulo.");

            _cache.Set(cacheKey, newAssistantId, TimeSpan.FromHours(2));
            return newAssistantId;
        }

        private async Task<string> GetOrCreateThreadIdAsync(string apiKey, int userId, int idBot)
        {
            var cacheKey = GetThreadCacheKey(userId, idBot);
            if (_cache.Get(cacheKey) is string threadId && !string.IsNullOrEmpty(threadId))
            {
                return threadId;
            }

            var newThreadId = await OpenAIUtils.CreateThreadAsync(apiKey);
            if (string.IsNullOrEmpty(newThreadId))
                throw new InvalidOperationException("El ID del thread no puede ser nulo.");

            _cache.Set(cacheKey, newThreadId, TimeSpan.FromHours(2));
            return newThreadId;
        }

        private async Task<string> GetOrCreateVectorStoreIdAsync(string apiKey, int idBot, string fileId)
        {
            var cacheKey = GetVectorStoreCacheKey(idBot);
            if (_cache.Get(cacheKey) is string vectorStoreId && !string.IsNullOrEmpty(vectorStoreId))
            {
                return vectorStoreId;
            }

            var newVectorStoreId = await OpenAIUtils.CreateVectorStoreAsync(apiKey, fileId);
            //while (!await OpenAIUtils.IsVectorStoreReadyAsync(apiKey, newVectorStoreId))
            //{
            //    await Task.Delay(1000);
            //}

            if (string.IsNullOrEmpty(newVectorStoreId))
                throw new InvalidOperationException("El ID del Vector Store no puede ser nulo.");

            _cache.Set(cacheKey, newVectorStoreId, TimeSpan.FromDays(7));
            return newVectorStoreId;
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
