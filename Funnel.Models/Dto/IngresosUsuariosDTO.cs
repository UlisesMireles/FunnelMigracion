using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class IngresosUsuariosDTO
    {
        public int IdUsuario { get; set; }
        public string Usuario { get; set; }        
        public int Total { get; set; }
        public List<int> Anios { get; set; }
        public List<IngresosUsuariosPorMes> Data { get; set; }
        public List<string> Ips { get; set; }
        public List<string> Ubicaciones { get; set; }
    }

    public class IngresosUsuariosPorMes
    {
        public string Usuario { get; set; }
        public int Anio { get; set; }
        public int Mes { get; set; }
        public string MesTexto { get; set; }
        public int TotalAccesos { get; set; }

        public Dictionary<string, int> AccesosPorIp { get; set; } = new Dictionary<string, int>();
    }
}
