using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Funnel.Logic.Utils
{
    public class Correo
    {
        private readonly IConfiguration _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

        public bool EnviarCorreo(string sTo, string sAsunto, string sMensaje)
        {
            try
            {
                string sServidor = Convert.ToString(_configuration["EmailServer:ServidorSMTP"]);
                int iPuerto = Convert.ToInt32(_configuration["EmailServer:PuertoSMTP"]);
                string sUsuario = Convert.ToString(_configuration["EmailServer:usuarioSMTP"]);
                string sPwd = Convert.ToString(_configuration["EmailServer:pwdSMTP"]);

                string[] sDestinatarios = sTo.Split(';');

                MailMessage msg = new MailMessage();

                if (sTo.IndexOf(';') >= 0)
                {
                    for (int i = 0; i < sDestinatarios.Length; i++)
                        msg.To.Add(new MailAddress(sDestinatarios[i]));
                }
                else
                {
                    msg.To.Add(new MailAddress(sTo));
                }

                msg.From = new MailAddress(sUsuario);

                msg.Subject = sAsunto;
                msg.Priority = MailPriority.Normal;
                msg.Body = sMensaje;
                msg.IsBodyHtml = true;

                SmtpClient clienteSmtp = new SmtpClient(sServidor);
                clienteSmtp.Host = sServidor;
                clienteSmtp.Port = iPuerto;
                clienteSmtp.EnableSsl = true;
                clienteSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                clienteSmtp.Credentials = new NetworkCredential(sUsuario, sPwd);

                clienteSmtp.Send(msg);

            }
            catch (Exception ex)
            {
                throw new Exception("Error al enviar el correo a " + sTo + " " + ex.Message);
            }
            return (true);
        }
    }
}
