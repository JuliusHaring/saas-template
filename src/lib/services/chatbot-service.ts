import { ChatBot } from "@prisma/client";
import {
  getChatBots,
  createChatBot,
  CreateChatBot,
  createGDriveSource,
  CreateGDriveSource,
} from "@/lib/db/chatbot";

export class ChatBotService {
  private static _instance: ChatBotService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getChatBots(userId: ChatBot["userId"]): Promise<ChatBot[]> {
    return getChatBots(userId);
  }

  public async createChatBot(
    userId: ChatBot["userId"],
    data: CreateChatBot,
  ): Promise<ChatBot> {
    return createChatBot(userId, data);
  }

  public async createGDriveSource(
    chatBotId: ChatBot["id"],
    data: CreateGDriveSource,
  ) {
    return createGDriveSource(chatBotId, data);
  }
}
