using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Funnel.Models.Dto;

namespace Funnel.Data.Utils
{
    public class BD
    {
        private static readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        private static string? conexion = Convert.ToString(_configuration["ConnectionStrings:FunelDatabase"]);

        public static async Task<string> GetJsonDataAsync(string query)
        {
            var queryFormat = $"SELECT ({query} FOR JSON AUTO)";
            try
            {
                using SqlConnection conn = new SqlConnection(conexion);
                using SqlCommand cmd = new SqlCommand(queryFormat, conn);

                if (cmd.Connection.State == ConnectionState.Closed)
                {
                    cmd.Connection.Open();
                }

                string? result = await cmd.ExecuteScalarAsync() as string;
                if (result == null)
                {
                    return string.Empty;
                }
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        public static async Task InsertDataAsync(string tabla, ConsultaAsistente consultaAsistente)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(conexion))
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    string sql = $"INSERT INTO {tabla} ([IdBot],[Pregunta],[Respuesta],[Fecha],[Respondio],[TokensEntrada],[TokensSalida],[IdUsuario]) VALUES (@IdBot, @Pregunta ,@Respuesta, @Fecha, @Respondio, @TokensEntrada, @TokensSalida, @IdUsuario)";
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.Add("@IdBot", SqlDbType.Int).Value = consultaAsistente.IdBot;
                        cmd.Parameters.Add("@Pregunta", SqlDbType.VarChar, 500).Value = consultaAsistente.Pregunta;
                        cmd.Parameters.Add("@Respuesta", SqlDbType.VarChar, -1).Value = consultaAsistente.Respuesta;
                        cmd.Parameters.Add("@Fecha", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@Respondio", SqlDbType.Bit).Value = consultaAsistente.Exitoso;
                        cmd.Parameters.Add("@TokensEntrada", SqlDbType.Int).Value = consultaAsistente.TokensEntrada;
                        cmd.Parameters.Add("@TokensSalida", SqlDbType.Int).Value = consultaAsistente.TokensSalida;
                        cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = consultaAsistente.IdUsuario;
                        cmd.CommandType = CommandType.Text;
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }
    }
}
