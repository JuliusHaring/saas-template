import { ChatBotService } from "@/lib/services/chatbot-service";
import { OpenAIService } from "@/lib/services/openai-service";

const chatbotService = ChatBotService.Instance;
const openaiService = OpenAIService.Instance;

export async function GET(request: Request): Promise<Response> {
  const userId = "test";
  const assistantId = "asst_oaORWvNRS05eT8Q8Eg3uihQ7";

  const chatBot = await chatbotService.getChatBot(userId, assistantId);

  return Response.json({});
}
