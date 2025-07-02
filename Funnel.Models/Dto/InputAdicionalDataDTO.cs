using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class InputAdicionalDataDTO
    {
        public int IdInput { get; set; }
        public string Nombre { get; set; }
        public string Etiqueta { get; set; }
        public string TipoCampo { get; set; }
        public int RCatalogoInputId { get; set; }
        public int Orden { get; set; }
        public int IdInputData { get; set; }
        public string Valor { get; set; }
        public int IdReferencia { get; set; }
        public int TipoCatalogoInputId { get; set; }
        public string TipoCatalogoInput { get; set; }
    }
}
