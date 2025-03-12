import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { UpdateChatBotType } from "@/lib/db/types";
import { getUserId } from "@/lib/utils/routes/auth";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { type NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId(request);
    const chatBotId = (await params).chatBotId;

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatBot = await chatbotService.getChatBot(userId, chatBotId);
    return chatBot;
  },
);

export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId(request);
    const chatBotId = (await params).chatBotId;
    const data: UpdateChatBotType = await request.json();

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatBot = await chatbotService.updateChatBot(userId, chatBotId, data);
    return chatBot;
  },
);

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId(request);
    const chatBotId = (await params).chatBotId;

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatbotDelete = await chatbotService.deleteChatBot(userId, chatBotId);

    return chatbotDelete;
  },
);
