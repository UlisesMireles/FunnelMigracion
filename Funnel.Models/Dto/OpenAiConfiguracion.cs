using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class OpenAiConfiguracion
    {
        public class Message
        {
            public string role { get; set; } = string.Empty;// "user", "system" o "assistant"
            public string content { get; set; } = string.Empty;
        }

        public class FunctionCall
        {
            public string name { get; set; } = string.Empty;
            public string description { get; set; } = string.Empty;// Agrega una descripción de la función
            public Dictionary<string, object>? parameters { get; set; }
        }

        public class ChatRequestBody
        {
            public string model { get; set; } = string.Empty;
            public List<Message>? messages { get; set; }
            public double temperature { get; set; }
            public int max_tokens { get; set; } = 200; 
        }

        public class ChatRequestBodyConFunctionCalls : ChatRequestBody
        {
            public List<FunctionCall>? functions { get; set; }
        }

    }
}
