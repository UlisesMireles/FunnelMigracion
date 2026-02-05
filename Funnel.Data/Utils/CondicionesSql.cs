using Funnel.Models.Dto;
using Funnel.Data.Enum;

namespace Funnel.Data.Utils
{
    public class CondicionesSql
    {
        public static string Condicion(string query, ConsultaAsistente consultaAsistente)
        {

            TipoConsulta tipoQuery = AnalizaTipoConsulta(query);

            switch (tipoQuery.Id)
            {
                case (int)TipoCondiciones.None:
                    {
                        query = tipoQuery.ParteUno + "ConsultaGeneralOportunidades WHERE #IdCondicion# = #VALOR# " + tipoQuery.ParteDos;
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
                case (int)TipoCondiciones.WHERE:
                    {
                        query += " AND #IdCondicion# = #VALOR#";
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
                case (int)TipoCondiciones.ORDERBY:
                    {
                        query = tipoQuery.ParteUno + "WHERE #IdCondicion# = #VALOR# ORDER BY " + tipoQuery.ParteDos;
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
                case (int)TipoCondiciones.GROUPBY:
                    {
                        query = tipoQuery.ParteUno + "WHERE #IdCondicion# = #VALOR# GROUP BY " + tipoQuery.ParteDos;
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
                case (int)TipoCondiciones.WHEREORDERBY:
                    {
                        query = tipoQuery.ParteUno + " AND #IdCondicion# = #VALOR# ORDER BY " + tipoQuery.ParteDos;
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
                case (int)TipoCondiciones.WHEREORDERBYGROUPBY:
                case (int)TipoCondiciones.WHEREGROUPBY:
                case (int)TipoCondiciones.ORDERBYGROUPBY:
                    {
                        query = tipoQuery.ParteUno + " AND #IdCondicion# = #VALOR# GROUP BY " + tipoQuery.ParteDos;
                        query = GeneraQuery(consultaAsistente, query);
                        break;
                    }
            }
            return query;
        }
        private static string GeneraQuery(ConsultaAsistente consulta, string query)
        {
            switch (consulta.IdTipoUsuario)
            {
                case (int)TipoUsuario.Administrador:
                case (int)TipoUsuario.Gerente:
                    {
                        query = query.Replace("#IdCondicion#", "IdEmpresa").Replace("#VALOR#", consulta.IdEmpresa.ToString());
                        break;
                    }
                case (int)TipoUsuario.Agente:
                    {
                        query = query.Replace("#IdCondicion#", "IdEjecutivo").Replace("#VALOR#", consulta.IdUsuario.ToString());
                        break;
                    }
            }
            return query;
        }
        private static TipoConsulta AnalizaTipoConsulta(string query)
        {
            TipoConsulta consulta = new TipoConsulta();
            string[] newQuery = null;
            if (query.Contains("WHERE") && query.Contains("GROUP BY") && query.Contains("ORDER BY"))
            {
                consulta.Id = 5;
                newQuery = query.Split("GROUP BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("WHERE") && query.Contains("GROUP BY"))
            {
                consulta.Id = 6;
                newQuery = query.Split("GROUP BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("GROUP BY") && query.Contains("ORDER BY"))
            {
                consulta.Id = 7;
                newQuery = query.Split("GROUP BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("WHERE") && query.Contains("ORDER BY"))
            {
                consulta.Id = 4;
                newQuery = query.Split("ORDER BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("WHERE"))
            {
                consulta.Id = 1;
                newQuery = query.Split("WHERE");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("ORDER BY"))
            {
                consulta.Id = 2;
                newQuery = query.Split("ORDER BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            if (query.Contains("GROUP BY"))
            {
                consulta.Id = 3;
                newQuery = query.Split("GROUP BY");
                consulta.ParteUno = newQuery[0];
                if (newQuery.Length > 1)
                {
                    consulta.ParteDos = newQuery[1];
                }
                return consulta;
            }

            newQuery = query.Split("ConsultaGeneralOportunidades");
            consulta.ParteUno = newQuery[0];
            if (newQuery.Length > 1)
            {
                consulta.ParteDos = newQuery[1];
            }

            return consulta;
        }
    }
}
