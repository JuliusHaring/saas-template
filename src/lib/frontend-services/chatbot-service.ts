import {
  ChatBotIdType,
  ChatBotType,
  CreateChatBotType,
  UpdateChatBotType,
  WebsiteSourceType,
} from "../db/types";
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

  public async getChatBot(chatBotId: ChatBotIdType) {
    return fetchJson<ChatBotType>(`/api/chatbot/${chatBotId}`);
  }

  public async createChatBot(formValues: CreateChatBotType) {
    return fetchJson<ChatBotType>("/api/chatbot", {
      method: "POST",
      body: JSON.stringify(formValues),
    });
  }

  public async deleteChatBot(chatBotId: ChatBotIdType) {
    return fetchJson<ChatBotType>(`/api/chatbot/${chatBotId}`, {
      method: "DELETE",
    });
  }

  public async updateChatBot(
    chatBotId: ChatBotIdType,
    updateChatBot: UpdateChatBotType,
  ) {
    return fetchJson<ChatBotType>(`/api/chatbot/${chatBotId}`, {
      method: "PUT",
      body: JSON.stringify(updateChatBot),
    });
  }

  public async deleteWebsiteSource(chatBotId: ChatBotIdType) {
    return fetchJson<WebsiteSourceType>(`/api/chatbot/source/${chatBotId}`, {
      method: "DELETE",
    });
  }
}
