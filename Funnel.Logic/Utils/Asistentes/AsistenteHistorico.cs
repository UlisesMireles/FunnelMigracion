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

        private async Task<RespuestaOpenIA> BuildAnswer(string pregunta, int idBot)
        {
            RespuestaOpenIA respuestaOpenIA = new();

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
            var configuracion = result.FirstOrDefault();
            if (configuracion == null)
                throw new Exception("No se encontró configuración para el asistente con IdBot: " + idBot);

            var systemMessage = string.Format(configuracion.Prompt, pregunta);

            var messages = new List<Message>
            {
                new Message { role = "system", content = systemMessage }
            };

            var requestBody = new ChatRequestBody
            {
                model = configuracion.Modelo,
                messages = messages,
                temperature = 0.7,
                max_tokens = 900
            };

            var chatRespuestaOpenIA = await OpenIAFunciones.ChatCompletionAsync(configuracion.Llave, requestBody);
            respuestaOpenIA.Respuesta = chatRespuestaOpenIA.choices[0].message.content.Trim();
            respuestaOpenIA.TokensEntrada = chatRespuestaOpenIA.usage.prompt_tokens;
            respuestaOpenIA.TokensSalida = chatRespuestaOpenIA.usage.total_tokens;

            return respuestaOpenIA;
        }

        //public async Task EvaluarProspectosYAsignarNivelAsync(IProspectoData prospectoData, int IdEmpresa)
        public async Task EvaluarProspectosYAsignarNivelAsync(IProspectoData prospectoData)
        {
           // var prospectos = await prospectoData.ConsultarProspectos(IdEmpresa);
            var prospectos = await prospectoData.ConsultarProspectosTodos();

            foreach (var prospecto in prospectos)
            {
                string input = $"Nombre: {prospecto.Nombre}. Descripción estatus: {prospecto.DesEstatus}. Nombre sector: {prospecto.NombreSector}. Total oportunidades: {prospecto.TotalOportunidades}. Porcentaje efectividad: {prospecto.PorcEfectividad}. Promedio días etapa 1: {prospecto.PromDiasEtapa1}. Promedio días etapa 2: {prospecto.PromDiasEtapa2}. Promedio días etapa 3: {prospecto.PromDiasEtapa3}. Promedio días etapa 4: {prospecto.PromDiasEtapa4}. Promedio días etapa 5: {prospecto.PromDiasEtapa5}. Promedio días sin actividad: {prospecto.PromDiasSinActividad}.";


                var respuesta = await BuildAnswer(input, 7); 

                if (int.TryParse(respuesta.Respuesta, out int nivel) && nivel >= 1 && nivel <= 3)
                {
                    await prospectoData.ActualizarNivelInteres(prospecto.IdProspecto, nivel);
                }
            }
        }
    }
    }

