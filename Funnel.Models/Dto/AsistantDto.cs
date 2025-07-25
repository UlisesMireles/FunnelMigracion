
namespace Funnel.Models.Dto
{
    public class AssistantResponse
    {
        public string Content { get; set; }
        public int PromptTokens { get; set; }
        public int CompletionTokens { get; set; }
    }
    public class RunUsage
    {
        public int PromptTokens { get; set; }
        public int CompletionTokens { get; set; }
        public int TotalTokens { get; set; }
    }
}
