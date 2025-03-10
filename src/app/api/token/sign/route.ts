import { ChatBotIdType } from "@/lib/db/types";
import { signToken } from "@/lib/utils/backend/token";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { ChatBot } from "@prisma/client";
import { NextRequest } from "next/server";

export type SignTokenType = {
  chatBotId: ChatBotIdType;
  allowedDomains: ChatBot["allowedDomains"];
};

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body: SignTokenType = await request.json();

  return signToken(body.chatBotId, body.allowedDomains);
});
