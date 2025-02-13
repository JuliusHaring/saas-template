import { ChatBotService } from "@/lib/api-services/chatbot-service";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const chatBotId = (await params).chatBotId;

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatBot = await chatbotService.getChatBotName(chatBotId);
    return chatBot;
  },
);
