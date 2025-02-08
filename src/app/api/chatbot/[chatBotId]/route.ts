import { ChatBotService } from "@/lib/api-services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { type NextRequest } from "next/server";

const chatbotService = ChatBotService.Instance;

export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: { chatBotId: string } }, // Extract params from Next.js App Router
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId; // Get chatBotId from the route parameters

    if (!chatBotId) {
      throw NotFound(`ChatBot ${chatBotId} not found`);
    }

    const chatbotDelete = await chatbotService.deleteChatBot(userId, chatBotId);

    return chatbotDelete;
  },
);
