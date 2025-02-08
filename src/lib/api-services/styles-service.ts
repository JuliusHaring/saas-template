import { createOrUpdateStyle, getStyle } from "@/lib/db/styles";
import { ChatBotIdType, StyleCssType, UserIdType } from "../db/types";

class StylesService {
  private static _instance: StylesService;

  private constructor() {}

  public static getInstance(): StylesService {
    if (!this._instance) {
      this._instance = new StylesService();
    }
    return this._instance;
  }

  async getStyle(chatBotId: ChatBotIdType) {
    return await getStyle(chatBotId);
  }

  async saveStyle(
    userId: UserIdType,
    chatBotId: ChatBotIdType,
    css: StyleCssType,
  ) {
    return await createOrUpdateStyle(userId, chatBotId, css);
  }
}

export const stylesService = StylesService.getInstance();
