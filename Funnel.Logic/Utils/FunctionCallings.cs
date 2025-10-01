using Funnel.Data.Utils;
using Funnel.Models.Dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Utils
{
    public class FunctionCallings
    {
        public static async Task<string> ExecuteFunction(string functionName, string parameters, ConsultaAsistente consultaAsistente)
        {

            var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(parameters);
            if (values == null)
            {
                return string.Empty;
            }
            switch (functionName)
            {
                case "query_opportunity_data":
                    if (values.ContainsKey("period"))
                    {
                        //llamar a la funcion query oportunitiy data 
                        var period = values["period"].ToString();
                        DateTime startDate = new DateTime(1900, 01, 01);
                        DateTime endDate = DateTime.Now;

                        if (period != null)
                        {
                            switch (period.ToLower())
                            {
                                case "esta semana":
                                    startDate = DateTime.Now.AddDays(-7);
                                    break;
                                case "esta quincena":
                                    startDate = DateTime.Now.AddDays(-15);
                                    break;
                                case "esta mes":
                                    startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                                    break;
                                default:
                                    var textSpplit = period.Split(' ');
                                    if (textSpplit.Length != 2) // check if you splitted correct, and have 3 entries
                                        return "";

                                    var args = new { value = textSpplit[0], parameter = textSpplit[1] };

                                    if (args.parameter.IndexOf("semana", StringComparison.OrdinalIgnoreCase) >= 0 || args.parameter.IndexOf("mes", StringComparison.OrdinalIgnoreCase) >= 0)
                                    {
                                        switch (args.parameter)
                                        {
                                            case "semana":
                                                var numberWeeks = int.Parse(args.value) * 7;
                                                startDate = DateTime.Now.AddDays(-numberWeeks);
                                                break;
                                            case "mes":
                                                startDate = DateTime.Now.AddMonths(-int.Parse(args.value));
                                                break;
                                        }
                                    }
                                    else
                                    {
                                        switch (args.value)
                                        {
                                            case "semana":
                                                var numberWeeks = int.Parse(args.parameter) * 7;
                                                startDate = DateTime.Now.AddDays(-numberWeeks);
                                                break;
                                            case "mes":
                                                startDate = DateTime.Now.AddMonths(-int.Parse(args.parameter));
                                                break;
                                        }
                                    }
                                    break;
                            }

                        }

                        var getData = await BD.GetJsonDataAsync(CondicionesSql.Condicion($@"
                                                            SELECT NombreOportunidad, Probabilidad, NombreProspecto, DiasSinActividad, NombreSector, 
                                                                CONVERT(VARCHAR(10), FechaEstimadaCierre, 103) as FechaEstimadaCierre, CONVERT(VARCHAR(10), 
                                                                FechaRegistro, 103) as FechaRegistro, CONVERT(VARCHAR(10), FechaModificacion, 103) as FechaModificacion
                                                            FROM ConsultaGeneralOportunidades 
                                                            WHERE EstatusOportunidad = 'En Proceso' AND FechaEstimadaCierre BETWEEN '{startDate}' AND '{endDate}'"
                                                            , consultaAsistente));
                        return getData; // Ejemplo de llamada a una API de clima
                    }
                    break;

                case "get_mayorProbabilidadSemana":
                    // llamar a la funcion get mayo probabilidad semana
                    var getDataMayorProbabilidadSemana = await BD.GetJsonDataAsync(CondicionesSql.Condicion(@"
                                                                                    SELECT 
                                                                                        NombreOportunidad,
                                                                                        Probabilidad,
                                                                                        NombreProspecto,
                                                                                        Monto
                                                                                    FROM ConsultaGeneralOportunidades
                                                                                    WHERE EstatusOportunidad = 'En Proceso'
                                                                                        AND FechaEstimadaCierre BETWEEN GETDATE()
                                                                                        AND DATEADD(DAY, 30, GETDATE())", consultaAsistente));

                    return getDataMayorProbabilidadSemana;

                case "get_mayorProbabilidad":
                    //llamar a funcion mayor probabilidad
                    var getDataMayorProbabilidad = await BD.GetJsonDataAsync(CondicionesSql.Condicion(@"
                                                                                SELECT 
                                                                                    NombreOportunidad,
                                                                                    Probabilidad,
                                                                                    NombreProspecto,
                                                                                    Monto
                                                                                FROM ConsultaGeneralOportunidades
                                                                                WHERE EstatusOportunidad = 'En Proceso'
                                                                                    AND FechaEstimadaCierre 
                                                                                    BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE())
                                                                                ", consultaAsistente));
                    return getDataMayorProbabilidad;

                case "get_MayorPosibilidadSector":
                    //llamar a funcion mayor posibilidad sector
                    var getDataMayorPosibilidadSector = await BD.GetJsonDataAsync(CondicionesSql.Condicion(@"
                                                                                SELECT 
                                                                                    NombreOportunidad,
                                                                                    Probabilidad,
                                                                                    NombreSector
                                                                                FROM ConsultaGeneralOportunidades
                                                                                WHERE EstatusOportunidad = 'En Proceso'
                                                                                    AND FechaEstimadaCierre BETWEEN GETDATE() 
                                                                                    AND DATEADD(DAY, 30, GETDATE())
		                                                                            AND NombreSector <> 'Por asignar'
                                                                                ", consultaAsistente));
                    return getDataMayorPosibilidadSector;

                case "get_OportunidadesEnRiesgo":
                    // llamar funcion oportunidades en riesgo
                    var getDataOportunidadEnRiesgo = await BD.GetJsonDataAsync(CondicionesSql.Condicion(@"
                                                                                SELECT 
                                                                                    NombreOportunidad,
                                                                                    Monto,
                                                                                    NombreProspecto,
                                                                                    Riesgo,
                                                                                    DiasSinActividad
                                                                                FROM ConsultaGeneralOportunidades
                                                                                WHERE EstatusOportunidad = 'En Proceso'
                                                                                    AND FechaEstimadaCierre 
                                                                                    BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE())
                                                                                ", consultaAsistente));
                    return getDataOportunidadEnRiesgo;

                default:
                    return "Función no reconocida o parámetros faltantes.";
            }
            return "Parámetros insuficientes para ejecutar la función.";
        }
    }
}
