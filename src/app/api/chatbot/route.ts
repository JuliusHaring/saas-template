import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";

const chatbotService = ChatBotService.Instance;

export async function POST(request: Request) {
  const userId = await getUserId();
  const { assistantId, createArgs } = await request.json();

  return chatbotService.createChatBot(userId, assistantId, createArgs);
}
