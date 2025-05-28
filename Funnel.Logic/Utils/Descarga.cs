using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Logic.Utils
{
    public class Descarga
    {
        public static async Task<string> DescargarImagenComoBase64(string urlImagen)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true
            };

            using var httpClient = new HttpClient(handler);
            byte[] imagenBytes = await httpClient.GetByteArrayAsync(urlImagen);
            string imagenBase64 = Convert.ToBase64String(imagenBytes);

            // Detecta tipo MIME a partir de extensión o cabecera si lo necesitas
            string mimeType = "image/png"; // Cambia esto si es JPG, SVG, etc.

            return $"data:{mimeType};base64,{imagenBase64}";
        }
    }
}
