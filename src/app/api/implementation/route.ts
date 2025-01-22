import { ChatBotService } from "@/lib/services/chatbot-service";
import { OpenAIService } from "@/lib/services/openai-service";

const chatbotService = ChatBotService.Instance;

export async function GET(request: Request) {
  // const userId = await getUser();
  const userId = "test";

  const openAIService = OpenAIService.Instance;
  const answer = await openAIService.chats.chatWithThread(
    "asst_uRHZ0uV6NNxm8TP7IPMdEaP1",
    "test_session",
    "whats up?",
  );

  return Response.json(answer);
}
