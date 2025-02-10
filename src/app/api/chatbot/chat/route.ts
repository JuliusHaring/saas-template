import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import {
  Quota,
  QuotaReachedException,
  QuotaService,
} from "@/lib/api-services/quotas-service";
import {
  withErrorHandling,
  BadRequest,
  Forbidden,
  TooManyRequests,
} from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { OpenAIChatService } from "@/lib/api-services/chat/open-ai-chat-service";

const openAIChatService = OpenAIChatService.Instance;
const quotaService = QuotaService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { chatBotId, sessionId: providedSessionId, userMessage, token } = body;

  if (!chatBotId || !userMessage || !token) {
    throw BadRequest("Missing required fields");
  }

  try {
    // Verify the signed token
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      chatBotId: string;
      allowedDomains: string[];
    };

    if (decoded.chatBotId !== chatBotId) {
      throw Forbidden("Invalid chatbot ID");
    }

    // Validate that the request comes from an allowed domain
    const referer = request.headers.get("referer") || "";
    if (!decoded.allowedDomains.some((domain) => referer.includes(domain))) {
      throw Forbidden("Unauthorized website");
    }

    // Proceed with quota check and chatbot logic
    await quotaService.getChatBotQuotaRemainder(
      chatBotId,
      Quota.MAX_CHAT_MESSAGES,
    );
  } catch (e) {
    if (e instanceof QuotaReachedException) {
      throw TooManyRequests(`Quota reached for ChatBot ${chatBotId}`);
    }
    if (e instanceof TokenExpiredError) {
      throw Forbidden("Token has expired, please refresh the page.");
    }
    if (e instanceof JsonWebTokenError) {
      throw Forbidden("Invalid token.");
    }
    if (e instanceof NotBeforeError) {
      throw Forbidden("Token is not valid yet.");
    }
    throw e;
  }

  const sessionId = providedSessionId || uuidv4();
  const answer = await openAIChatService.chatWithThread(
    chatBotId,
    sessionId,
    userMessage,
  );
  await quotaService.updateChatbotUsage(chatBotId, Quota.MAX_CHAT_MESSAGES, 1);

  return { answer, sessionId };
});
