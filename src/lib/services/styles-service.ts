import { createOrUpdateStyle, getStyle } from "@/lib/db/styles";
import { ChatBot, Style } from "@prisma/client";

class StylesService {
  private static _instance: StylesService;

  private constructor() { }

  public static getInstance(): StylesService {
    if (!this._instance) {
      this._instance = new StylesService();
    }
    return this._instance;
  }

  async getStyle(assistantId: Style["assistantId"]) {
    return await getStyle(assistantId);
  }

  async saveStyle(
    userId: ChatBot["userId"],
    assistantId: Style["assistantId"],
    css: Style["css"],
  ) {
    return await createOrUpdateStyle(userId, assistantId, css);
  }
}

export const stylesService = StylesService.getInstance();
