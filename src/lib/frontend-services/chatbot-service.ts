import { ChatBotIdType, ChatBotType, CreateChatBotType } from "../db/types";
import { fetchJson } from "../utils/fetch";

export class FEChatBotService {
  private static _instance: FEChatBotService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getChatBots() {
    return fetchJson<ChatBotType[]>("/api/chatbot");
  }

  public async createChatBot(formValues: CreateChatBotType) {
    return fetchJson<ChatBotType>("/api/chatbot", {
      method: "POST",
      body: JSON.stringify(formValues),
    });
  }

  public async deleteChatBot(chatbotId: ChatBotIdType) {
    return fetchJson<ChatBotType>(`/api/chatbot/${chatbotId}`, {
      method: "DELETE",
    });
  }
}
