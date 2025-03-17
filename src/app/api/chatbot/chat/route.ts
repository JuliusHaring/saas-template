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
    parentDomain,
  }: ChatRequestType = body;

  if (!chatBotId || !userMessage || !token || !parentDomain) {
    throw BadRequest("Missing required fields");
  }

  try {
    // Verify the signed token
    const decoded = verifyToken(token);

    console.log(`Decoded token: ${JSON.stringify(decoded)}`);

    if (decoded.chatBotId !== chatBotId) {
      throw Forbidden("Invalid chatbot ID");
    }

    let allowedDomains;
    try {
      allowedDomains = decoded.allowedDomains.map((allowedDomain) => {
        if (allowedDomain.includes("localhost")) return allowedDomain;

        if (!allowedDomain.includes("http"))
          throw new Error(
            `Domain ${allowedDomain} is missing protocol information`,
          );

        return new URL(allowedDomain).hostname;
      });
    } catch (e) {
      console.error(
        `Error parsing urls for allowed domains: ${allowedDomains}`,
      );
      throw e;
    }

    if (!allowedDomains.includes(parentDomain)) {
      throw Forbidden(
        `Unauthorized parentDomain: ${parentDomain}. Allowed are: ${decoded.allowedDomains.join(", ")}`,
      );
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
