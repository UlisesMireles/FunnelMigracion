using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class EstancamientoEstadisticaOportunidadDto
    {
        public int IdOportunidad { get; set; }
        public string Oportunidad { get; set; }
        public string Etapa { get; set; }
        public int DiasFunnel { get; set; }
        public decimal MediaDias { get; set; }
        public decimal MediaDiasEtapa1 { get; set; }
        public decimal DesvDias { get; set; }
        public int DiasEtapa1 { get; set; }
        public int DiasEtapa2 { get; set; }
        public int DiasEtapa3 { get; set; }
        public int DiasEtapa4 { get; set; }
        public int DiasEtapa5 { get; set; }
        public int Riesgo { get; set; }
        public decimal ZScoreFunnel { get; set; }
        public decimal ZScoreFunnelEtapa1 { get; set; }
        public decimal InactividadNorm { get; set; }
        public int CierreVencido { get; set; }
        public int ProbEstancada { get; set; }
        public decimal ScoreEstancamiento { get; set; }
    }

}
