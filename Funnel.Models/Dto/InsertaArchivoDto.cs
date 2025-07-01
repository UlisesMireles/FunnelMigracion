using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class InsertaArchivoDto : ArchivoDto
    {
        public IFormFile? Archivo { get; set; }
    }
}
