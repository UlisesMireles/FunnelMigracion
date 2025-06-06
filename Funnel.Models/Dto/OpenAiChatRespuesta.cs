using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Funnel.Models.Dto
{
    public class OpenAiChatRespuesta
    {
        public string id { get; set; } = string.Empty;
        public string @object { get; set; } = string.Empty;
        public int created { get; set; }
        public string model { get; set; } = string.Empty;
        public List<Choice>? choices { get; set; }
        public Usage? usage { get; set; }
        public string system_fingerprint { get; set; } = string.Empty;

        public class Choice
        {
            public int index { get; set; }
            public Message? message { get; set; }
            public object? logprobs { get; set; }
            public string finish_reason { get; set; } = string.Empty;
        }

        public class CompletionTokensDetails
        {
            public int reasoning_tokens { get; set; }
        }

        public class FunctionCall
        {
            public string name { get; set; } = string.Empty;
            public string arguments { get; set; } = string.Empty;
        }

        public class Message
        {
            public string role { get; set; } = string.Empty;
            public string content { get; set; } = string.Empty;
            public FunctionCall? function_call { get; set; }
            public object? refusal { get; set; }
        }

        public class PromptTokensDetails
        {
            public int cached_tokens { get; set; }
        }

        public class Usage
        {
            public int prompt_tokens { get; set; }
            public int completion_tokens { get; set; }
            public int total_tokens { get; set; }
            public PromptTokensDetails? prompt_tokens_details { get; set; }
            public CompletionTokensDetails? completion_tokens_details { get; set; }
        }
    }
}
