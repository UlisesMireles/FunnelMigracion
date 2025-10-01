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
    public class PreguntasFrecuentesData : IPreguntasFrecuentesRepository
    {
        private readonly string _connectionString;
        public PreguntasFrecuentesData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FunelDatabase");
        }
        public async Task<ListaPreguntasFrecuentesDto> PreguntasFrecuentes()
        {
            var preguntasFrecuentes = new List<PreguntasFrecuentesDto>();
            var lista = new ListaPreguntasFrecuentesDto();
            try
            {
                using (IDataReader reader = await DataBase.GetReader("F_PreguntasFrecuentesActivas", CommandType.StoredProcedure, _connectionString))
                {
                    while (reader.Read())
                    {
                        var ren = new PreguntasFrecuentesDto();
                        ren.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                        ren.IdBot = ComprobarNulos.CheckIntNull(reader["Idbot"]);
                        ren.Asistente = ComprobarNulos.CheckStringNull(reader["Asistente"]);
                        ren.Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]);
                        ren.Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]);
                        ren.FechaCreacion = ComprobarNulos.CheckDateTimeNull(reader["FechaCreacion"]);
                        ren.FechaModificacion = ComprobarNulos.CheckDateTimeNull(reader["FechaModificacion"]);
                        ren.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                        ren.IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]);
                        ren.Categoria = ComprobarNulos.CheckStringNull(reader["Categoria"]);
                        ren.Estatus = ComprobarNulos.CheckBooleanNull(reader["Estatus"]);

                        preguntasFrecuentes.Add(ren);
                    }

                    lista.PreguntasFrecuentes = preguntasFrecuentes;
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

        public async Task<PreguntasFrecuentesDto> PreguntasFrecuentesPorId(int id)
        {
            var dto = new PreguntasFrecuentesDto();
            try
            {
                IList<Parameter> listaParametros = new List<Parameter>
                {
                    DataBase.CreateParameter("@pId", DbType.Int32, 10, ParameterDirection.Input, false, "Id", DataRowVersion.Default, id)
                };

                using (IDataReader reader = await DataBase.GetReader("F_PreguntasFrecuentesPorId", CommandType.StoredProcedure, listaParametros, _connectionString))
                {
                    while (reader.Read())
                    {
                        dto.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                        dto.IdBot = ComprobarNulos.CheckIntNull(reader["Idbot"]);
                        dto.Asistente = ComprobarNulos.CheckStringNull(reader["Asistente"]);
                        dto.Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]);
                        dto.Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]);
                        dto.FechaCreacion = ComprobarNulos.CheckDateTimeNull(reader["FechaCreacion"]);
                        dto.FechaModificacion = ComprobarNulos.CheckDateTimeNull(reader["FechaModificacion"]);
                        dto.Activo = ComprobarNulos.CheckBooleanNull(reader["Activo"]);
                        dto.Categoria = ComprobarNulos.CheckStringNull(reader["Categoria"]);
                        dto.Estatus = ComprobarNulos.CheckBooleanNull(reader["Estatus"]);
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
        public async Task<ListaPreguntasFrecuentesCategoriaDto> ListaPreguntasFrecuentesCategoria()
        {
            var resultadoLista = new ListaPreguntasFrecuentesCategoriaDto();
            var consulta = new List<PreguntasFrecuentesCategoriaDto>();
            var lista = new ListaPreguntasFrecuentesCategoria();
            try
            {
                using (IDataReader reader = await DataBase.GetReader("F_PreguntasFrecuentesCategoria", CommandType.StoredProcedure, _connectionString))
                {
                    while (reader.Read())
                    {
                        var ren = new PreguntasFrecuentesCategoriaDto();
                        ren.Id = ComprobarNulos.CheckIntNull(reader["Id"]);
                        ren.IdBot = ComprobarNulos.CheckIntNull(reader["Idbot"]);
                        ren.IdCategoria = ComprobarNulos.CheckIntNull(reader["IdCategoria"]);
                        ren.Descripcion = ComprobarNulos.CheckStringNull(reader["Descripcion"]);
                        ren.MensajePrincipal = ComprobarNulos.CheckStringNull(reader["MensajePrincipal"]);
                        ren.Asistente = ComprobarNulos.CheckStringNull(reader["Asistente"]);
                        ren.Pregunta = ComprobarNulos.CheckStringNull(reader["Pregunta"]);
                        ren.Respuesta = ComprobarNulos.CheckStringNull(reader["Respuesta"]);
                        ren.Documento = ComprobarNulos.CheckBooleanNull(reader["Documento"]);
                        consulta.Add(ren);
                    }

                    lista.Lista = consulta;
                    lista.Result = true;
                }


                if (lista.Result.GetValueOrDefault())
                {
                    var asistentes = lista.Lista
                        .GroupBy(item => item.IdBot)
                        .Select(group => new AsitenteCategoriasDto
                        {
                            IdBot = group.Key,
                            Asistente = group.First().Asistente,
                            Documento = group.First().Documento,
                            PreguntasPorCategoria = group
                                .GroupBy(item => item.IdCategoria)
                                .Select(categoriaGroup => new CategoriaPregutasDto
                                {
                                    IdCategoria = categoriaGroup.Key,
                                    Descripcion = categoriaGroup.First().Descripcion,
                                    MensajePrincipal = categoriaGroup.First().MensajePrincipal,
                                    ListaPreguntasPorCategoria = categoriaGroup
                                        .Select(item => new PreguntasPorCategoriaDto
                                        {
                                            Pregunta = item.Pregunta,
                                            Respuesta = item.Respuesta
                                        }).ToList()
                                }).ToList()
                        }).ToList();

                    resultadoLista.Asistentes = asistentes;
                    resultadoLista.Result = true;
                }
            }
            catch (Exception ex)
            {
                lista.Result = false;
                lista.ErrorMessage = ex.Message;
            }

            return resultadoLista;
        }
    }
}
