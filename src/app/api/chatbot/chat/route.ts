import { IChatService } from "@/lib/api-services/chat/i-chat-service";
import { OpenAIChatService } from "@/lib/api-services/chat/open-ai-chat-service";
import { Quota, QuotaService } from "@/lib/api-services/quotas-service";
import { BadRequest, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const openAIChatService: IChatService = OpenAIChatService.Instance;
const quotaService = QuotaService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Parse the request body
  const body = await request.json();
  const { chatBotId, sessionId: providedSessionId, userMessage } = body;

  // Validate input
  if (!chatBotId) throw BadRequest("Missing required field: chatBotId");
  if (!userMessage) throw BadRequest("Missing required field: userMessage");

  await quotaService.getChatBotQuotaRemainder(
    chatBotId,
    Quota.MAX_CHAT_MESSAGES,
  );

  // Use provided sessionId or generate a new one
  const sessionId = providedSessionId || uuidv4();

  // Call OpenAI service to interact with the chatbot
  const answer = await openAIChatService.chatWithThread(
    chatBotId,
    sessionId,
    userMessage,
  );

  await quotaService.updateChatbotUsage(chatBotId, Quota.MAX_CHAT_MESSAGES, 1);

  return {
    answer,
    sessionId,
  };
});
