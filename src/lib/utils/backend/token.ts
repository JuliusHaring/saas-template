import { ChatBotIdType } from "@/lib/db/types";
import { sign, verify } from "jsonwebtoken";

export function signToken(chatBotId: ChatBotIdType, allowedDomains: string[]) {
  return sign({ chatBotId, allowedDomains }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });
}

export function verifyToken(token: string) {
  return verify(token, process.env.JWT_SECRET!) as {
    chatBotId: string;
    allowedDomains: string[];
  };
}
