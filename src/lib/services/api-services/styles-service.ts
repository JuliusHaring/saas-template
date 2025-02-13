import { createOrUpdateStyle, getStyle } from "@/lib/db/styles";
import { ChatBotIdType, CreateStyleType, UserIdType } from "@/lib/db/types";

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
    createStyle: CreateStyleType,
  ) {
    return await createOrUpdateStyle(userId, chatBotId, createStyle);
  }
}

export const stylesService = StylesService.getInstance();
