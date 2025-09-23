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
using Funnel.Data.Interfaces;


namespace Funnel.Logic.Utils.Asistentes
{
    public class AsistenteHistorico
    {
        private static readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        private readonly IAsistentesData _asistentesData;
        private readonly string _connectionString;
        public AsistenteHistorico(IConfiguration configuration, IAsistentesData asistentesData)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
            _asistentesData = asistentesData;
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

                DateTime fechaPregunta = DateTime.Now;
                var respuestaOpenIA = await BuildAnswer(consultaAsistente.Pregunta, consultaAsistente.IdBot);

                consultaAsistente.Respuesta = respuestaOpenIA.Respuesta;
                consultaAsistente.TokensEntrada = respuestaOpenIA.TokensEntrada;
                consultaAsistente.TokensSalida = respuestaOpenIA.TokensSalida;
                consultaAsistente.Exitoso = true;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(consultaAsistente.IdBot);
                if (configuracion == null)
                    throw new Exception("No se encontró configuración para el asistente con IdBot: " + consultaAsistente.IdBot);
                var insertarBitacora = new InsertaBitacoraPreguntasDto
                {
                    IdBot = consultaAsistente.IdBot,
                    Pregunta = consultaAsistente.Pregunta,
                    FechaPregunta = fechaPregunta,
                    Respuesta = consultaAsistente.Respuesta,
                    FechaRespuesta = DateTime.Now,
                    Respondio = true,
                    TokensEntrada = consultaAsistente.TokensEntrada,
                    TokensSalida = consultaAsistente.TokensSalida,
                    IdUsuario = consultaAsistente.IdUsuario,
                    CostoPregunta = consultaAsistente.TokensEntrada * (configuracion.CostoTokensEntrada / 1000),
                    CostoRespuesta = consultaAsistente.TokensSalida * (configuracion.CostoTokensSalida / 1000),
                    CostoTotal = (consultaAsistente.TokensEntrada * (configuracion.CostoTokensEntrada / 1000)) + (consultaAsistente.TokensSalida * (configuracion.CostoTokensSalida / 1000)),
                    Modelo = configuracion.Modelo
                };
                await _asistentesData.InsertaPreguntaBitacoraPreguntas(insertarBitacora);
            }
            catch (Exception ex)
            {
                consultaAsistente.Exitoso = false;
                consultaAsistente.FechaRespuesta = DateTime.Now;
                consultaAsistente.Respuesta = "Ocurrió un error al procesar la pregunta: " + ex.Message;
            }

            return consultaAsistente;
        }

        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, int idBot)
        {
            RespuestaOpenIA respuestaOpenIA = new();

            var configuracion = await _asistentesData.ObtenerConfiguracionPorIdBotAsync(idBot);
            if (configuracion == null)
                throw new InvalidOperationException("No se encontró configuración para el asistente con IdBot: " + idBot);

            var systemMessage = string.Format(configuracion.Prompt, pregunta);

            var messages = new List<Message>
            {
                new Message { role = "system", content = systemMessage }
            };

            var requestBody = new ChatRequestBody
            {
                model = configuracion.Modelo,
                messages = messages,
                temperature = 1.0
            };

            var chatRespuestaOpenIA = await OpenAIUtils.CallResponsesApiAsync(configuracion.Llave, configuracion.Modelo, configuracion.Prompt, pregunta);
            respuestaOpenIA.Respuesta = chatRespuestaOpenIA.Content;
            respuestaOpenIA.TokensEntrada = chatRespuestaOpenIA.InputTokens;
            respuestaOpenIA.TokensSalida = chatRespuestaOpenIA.OutputTokens;
            return respuestaOpenIA;
        }
    }
}

