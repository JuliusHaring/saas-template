import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId();
  const { ...createArgs } = await request.json();

  const chatBot = await chatbotService.createChatBot(userId, createArgs);
  return chatBot;
});

export const GET = withErrorHandling(async () => {
  const userId = await getUserId();
  const chatBots = await chatbotService.getChatBots(userId);
  return chatBots;
});
