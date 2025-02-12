import {
  createChatBot,
  deleteChatBot,
  getAllowedDomainsForChatBot,
  getChatBot,
  getChatBots,
  getUserIdOfChatbot,
  updateChatBot as updateChatBotFunc,
} from "@/lib/db/chatbot";
import {
  ChatBotIdType,
  ChatBotType,
  CreateChatBotType,
  UpdateChatBotType,
  UserIdType,
} from "../db/types";

export class ChatBotService {
  private static _instance: ChatBotService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getUserIdOfChatbot(
    chatBotId: ChatBotIdType,
  ): Promise<UserIdType> {
    return getUserIdOfChatbot(chatBotId);
  }

  public async getChatBot(userId: UserIdType, chatBotId: ChatBotIdType) {
    return getChatBot(userId, chatBotId);
  }

  public async getAllowedDomainsForChatBot(
    chatBotId: ChatBotIdType,
  ): Promise<string[]> {
    return getAllowedDomainsForChatBot(chatBotId);
  }

  public async getChatBots(userId: UserIdType): Promise<ChatBotType[]> {
    return getChatBots(userId);
  }

  public async createChatBot(
    userId: UserIdType,
    createChatbot: CreateChatBotType,
  ): Promise<ChatBotType> {
    return createChatBot(userId, {
      name: createChatbot.name,
      instructions: createChatbot?.instructions,
    });
  }

  public async deleteChatBot(userId: UserIdType, chatBotId: ChatBotIdType) {
    return deleteChatBot(userId, chatBotId);
  }

  public async updateChatBot(
    userId: UserIdType,
    chatBotId: ChatBotIdType,
    updateChatBot: UpdateChatBotType,
  ) {
    return updateChatBotFunc(userId, chatBotId, updateChatBot);
  }
}
