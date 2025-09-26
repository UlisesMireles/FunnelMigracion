using Tiktoken;

namespace Funnel.Data.Utils
{
    public class TokenHelper
    {
        public static int CountTokens(string modelo, string prompt)
        {
            var encoder = ModelToEncoder.For(modelo);
            var tokens = encoder.Encode(prompt);
            var text = encoder.Decode(tokens);
            var numberOfTokens = encoder.CountTokens(text);
            return numberOfTokens;
        }
    }
}
