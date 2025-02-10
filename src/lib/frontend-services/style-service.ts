import { ChatBotIdType, CreateStyleType, StyleType } from "../db/types";
import { fetchJson } from "../utils/fetch";

export class FEStyleService {
  private static _instance: FEStyleService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getStyle(chatBotId: ChatBotIdType) {
    return fetchJson<StyleType>(`/api/chatbot/styles?chatBotId=${chatBotId}`);
  }

  public async createStyle(
    chatBotId: ChatBotIdType,
    createStyle: CreateStyleType,
  ) {
    return fetchJson<StyleType>(`/api/chatbot/styles`, {
      method: "POST",
      body: JSON.stringify({ chatBotId, createStyle }),
    });
  }
}
