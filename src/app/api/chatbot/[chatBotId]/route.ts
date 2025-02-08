import { ChatBotService } from "@/lib/api-services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { type NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatbotDelete = await chatbotService.deleteChatBot(userId, chatBotId);

    return chatbotDelete;
  },
);
