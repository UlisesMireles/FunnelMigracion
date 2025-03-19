using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Base
{
    public class BaseOut
    {
        public bool? Result { get; set; }
        public string? ErrorMessage { get; set; }
        public int Id { get; set; }
    }
}
