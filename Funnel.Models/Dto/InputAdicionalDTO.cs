using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class InputAdicionalDTO
    {
        public int IdInput { get; set; }
        public string Nombre { get; set; }
        public string Etiqueta { get; set; }
        public bool Requerido { get; set; }
        public string TipoCampo { get; set; }
        public int RCatalogoInputId { get; set; }
        public string TipoCatalogoInput { get; set; }
        public int Orden { get; set; }
        public bool Activo { get; set; }
    }
}
