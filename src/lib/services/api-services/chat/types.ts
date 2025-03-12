import { ChatBotIdType } from "@/lib/db/types";

export type ChatResponseType = {
  response: string;
  sessionId: string;
};

export type ChatRequestType = {
  chatBotId: ChatBotIdType;
  sessionId?: string | null;
  token: string;
  userMessage: string;
  parentDomain: string;
};
