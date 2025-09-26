using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Funnel.Data.Interfaces;

namespace Funnel.Data
{
    public class CategoriasData : ICategoriasRepository
    {
        private readonly string _connectionString;
        public CategoriasData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<ListaCategoriasDto> CategoriaPorBot(int idBot)
        {
            var categorias = new List<CategoriasDto>();
            var lista = new ListaCategoriasDto();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pIdBot", DbType.Int32, 10, ParameterDirection.Input, false, "IdBot", DataRowVersion.Default, idBot)
                };

                using (IDataReader reader = await DataBase.GetReader("F_CategoriasPorBot", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        var dto = new CategoriasDto
                        {
                            IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]),
                            Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]),
                            MensajePrincipal = ComprobarNulos.CheckStringNull(reader["MensajePrincipal"]),
                            LimitePreguntas = ComprobarNulos.CheckIntNull(reader["LimitePreguntas"]),
                            IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]),
                            NombreBot = ComprobarNulos.CheckStringNull(reader["NombreBot"]),
                            TotalPreguntas = ComprobarNulos.CheckIntNull(reader["TotalPreguntas"])
                        };
                        categorias.Add(dto);
                    }
                    lista.Categorias = categorias;
                    lista.Result = true;
                }
            }
            catch (Exception ex)
            {
                lista.Result = false;
                lista.ErrorMessage = ex.Message;
            }

            return lista;
        }

        public async Task<CategoriasDto> CategoriaPorId(int idCategoria)
        {
            var dto = new CategoriasDto();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pIdCategoria", DbType.Int32, 10, ParameterDirection.Input, false, "IdCategoria", DataRowVersion.Default, idCategoria)
                };

                using (IDataReader reader = await DataBase.GetReader("F_CategoriasPorId", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        dto.IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]);
                        dto.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                        dto.MensajePrincipal = ComprobarNulos.CheckStringNull(reader["MensajePrincipal"]);
                        dto.LimitePreguntas = ComprobarNulos.CheckIntNull(reader["LimitePreguntas"]);
                        dto.IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]);
                        dto.NombreBot = ComprobarNulos.CheckStringNull(reader["NombreBot"]);
                        dto.TotalPreguntas = ComprobarNulos.CheckIntNull(reader["TotalPreguntas"]);
                        dto.Result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                dto.Result = false;
                dto.ErrorMessage = ex.Message;
            }

            return dto;
        }

        public async Task<ListaCategoriasDto> Categorias()
        {
            var categorias = new List<CategoriasDto>();
            var lista = new ListaCategoriasDto();
            try
            {
                using (IDataReader reader = await DataBase.GetReader("F_Categorias", CommandType.StoredProcedure, _connectionString))
                {
                    while (reader.Read())
                    {
                        var ren = new CategoriasDto();
                        ren.IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]);
                        ren.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                        ren.MensajePrincipal = ComprobarNulos.CheckStringNull(reader["MensajePrincipal"]);
                        ren.LimitePreguntas = ComprobarNulos.CheckIntNull(reader["LimitePreguntas"]);
                        ren.IdBot = ComprobarNulos.CheckIntNull(reader["IdBot"]);
                        ren.NombreBot = ComprobarNulos.CheckStringNull(reader["NombreBot"]);
                        ren.TotalPreguntas = ComprobarNulos.CheckIntNull(reader["TotalPreguntas"]);
                        categorias.Add(ren);
                    }

                    lista.Categorias = categorias;
                    lista.Result = true;
                }
            }
            catch (Exception ex)
            {
                lista.Result = false;
                lista.ErrorMessage = ex.Message;
            }

            return lista;
        }
        public async Task<ListaPreguntasPorCategoriaDto> PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida()
        {
            var categorias = new List<CategoriaPregutasDto>();
            var lista = new ListaPreguntasPorCategoriaDto();
            try
            {
                using (IDataReader reader = await DataBase.GetReader("F_Categorias", CommandType.StoredProcedure, _connectionString))
                {
                    while (reader.Read())
                    {
                        var categoria = new CategoriaPregutasDto();

                        categoria.IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]);
                        categoria.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                        categoria.MensajePrincipal = ComprobarNulos.CheckStringNull(reader["MensajePrincipal"]);
                        categoria.ListaPreguntasPorCategoria = await PreguntasPorCategoria(categoria.IdCategoria);
                        if (categoria.ListaPreguntasPorCategoria.Count > 1)
                            categorias.Add(categoria);

                    }

                    lista.PreguntasPorCategoria = categorias;
                    lista.Result = true;
                }
            }
            catch (Exception ex)
            {
                lista.Result = false;
                lista.ErrorMessage = ex.Message;
            }

            return lista;
        }

        private async Task<List<PreguntasPorCategoriaDto>?> PreguntasPorCategoria(int idCategoria)
        {
            var listaPreguntasRespuesta = new List<PreguntasPorCategoriaDto>();

            IList<Parameter> listaParametros = new List<Parameter>
            {
                DataBase.CreateParameter("@pIdCategoria", DbType.String, 30, ParameterDirection.Input, false, "IdCategoria", DataRowVersion.Default, idCategoria)
            };

            using (IDataReader reader = await DataBase.GetReader("F_PreguntasFrecuentesPorIdCategoriaAsistenteBienvenida", CommandType.StoredProcedure, listaParametros, _connectionString))
            {
                while (reader.Read())
                {
                    var preguntas = new PreguntasPorCategoriaDto();
                    preguntas.Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]);
                    preguntas.Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]);
                    listaPreguntasRespuesta.Add(preguntas);
                }
            }

            return listaPreguntasRespuesta;
        }

    }
}
