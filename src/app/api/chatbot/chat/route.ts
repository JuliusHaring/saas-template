import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import {
  withErrorHandling,
  BadRequest,
  Forbidden,
} from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { OpenAIChatService } from "@/lib/services/api-services/chat/open-ai-chat-service";
import {
  ChatRequestType,
  ChatResponseType,
} from "@/lib/services/api-services/chat/types";
import { verifyToken } from "@/lib/utils/backend/token";

const openAIChatService = await OpenAIChatService.getInstance();

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const {
    chatBotId,
    sessionId: providedSessionId,
    userMessage,
    token,
  }: ChatRequestType = body;

  if (!chatBotId || !userMessage || !token) {
    throw BadRequest("Missing required fields");
  }

  try {
    // Verify the signed token
    const decoded = verifyToken(token);

    if (decoded.chatBotId !== chatBotId) {
      throw Forbidden("Invalid chatbot ID");
    }

    // Validate that the request comes from an allowed domain
    const referer = request.headers.get("referer") || "";
    if (!decoded.allowedDomains.some((domain) => referer.includes(domain))) {
      throw Forbidden("Unauthorized website");
    }
  } catch (e) {
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
  const response = await openAIChatService.chatWithThread(
    chatBotId,
    sessionId,
    userMessage,
  );

  return { response, sessionId } as ChatResponseType;
});
