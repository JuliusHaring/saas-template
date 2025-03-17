import {
  createChatBot,
  deleteChatBot,
  getAllowedDomainsForChatBot,
  getChatBot,
  getChatBotPublic,
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
} from "@/lib/db/types";

export class ChatBotService {
  private static _instance: ChatBotService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getUserIdOfChatbot(
    chatBotId: ChatBotIdType,
  ): Promise<UserIdType | null> {
    return getUserIdOfChatbot(chatBotId);
  }

  public async getChatBot(chatBotId: ChatBotIdType, userId?: UserIdType) {
    return getChatBot(chatBotId, userId);
  }

  public async getChatBotPublic(chatBotId: ChatBotIdType) {
    return getChatBotPublic(chatBotId);
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
    createChatbot: CreateChatBotType,
    userId?: UserIdType,
  ): Promise<ChatBotType> {
    return createChatBot(createChatbot, userId);
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
