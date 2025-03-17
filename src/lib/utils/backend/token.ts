import { ChatBotIdType } from "@/lib/db/types";
import { JWT_SECRET } from "@/lib/utils/environment";
import { sign, verify } from "jsonwebtoken";

export function signToken(chatBotId: ChatBotIdType, allowedDomains: string[]) {
  return sign({ chatBotId, allowedDomains }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

export function verifyToken(token: string) {
  return verify(token, JWT_SECRET) as {
    chatBotId: string;
    allowedDomains: string[];
  };
}
