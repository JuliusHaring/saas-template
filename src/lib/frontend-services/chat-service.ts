import { ChatRequestType, ChatResponseType } from "../db/types";
import { fetchJson } from "../utils/fetch";

export class FEChatService {
  private static _instance: FEChatService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async sendMessage(chatRequest: ChatRequestType) {
    return fetchJson<ChatResponseType>("/api/chatbot/chat", {
      method: "POST",
      body: JSON.stringify(chatRequest),
    });
  }
}
