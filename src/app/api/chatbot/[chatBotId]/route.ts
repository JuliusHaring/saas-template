import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { type NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId();
  const chatBotId = request.nextUrl.searchParams.get("chatBotId");

  const chatbotDelete = await chatbotService.deleteChatBot(userId, chatBotId!);

  return chatbotDelete;
});
