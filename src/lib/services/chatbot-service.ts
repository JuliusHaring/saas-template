import {
  ChatBotType,
  createChatBot,
  CreateChatBotType,
  deleteChatBot,
  getChatBot,
  getChatBots,
  getUserIdOfChatbot,
} from "@/lib/db/chatbot";
import { ChatBot, User } from "@prisma/client";
import { OpenAIService } from "./openai-service";

export type CreateChatbotBeforeAssistantType = Omit<
  CreateChatBotType,
  "assistantId"
>;

export class ChatBotService {
  private static _instance: ChatBotService;

  private openAIService!: OpenAIService;

  private constructor() {
    this.openAIService = OpenAIService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getUserIdOfChatbot(
    assistantId: ChatBot["assistantId"],
  ): Promise<User["userId"]> {
    return getUserIdOfChatbot(assistantId);
  }

  public async getChatBot(
    userId: User["userId"],
    assistantId: ChatBot["assistantId"],
  ) {
    return getChatBot(userId, assistantId);
  }

  public async getChatBots(userId: User["userId"]): Promise<ChatBot[]> {
    return getChatBots(userId);
  }

  public async createChatBot(
    userId: User["userId"],
    createAssistant?: CreateChatbotBeforeAssistantType,
  ): Promise<ChatBotType> {
    const assistant = await this.openAIService.createAssistant(
      userId,
      createAssistant || {},
    );
    return createChatBot(userId, {
      name: assistant.name!,
      instructions: createAssistant?.instructions,
      assistantId: assistant.id,
    });
  }

  public async deleteChatBot(
    userId: User["userId"],
    assistantId: ChatBot["assistantId"],
  ) {
    const assistant = await this.openAIService.deleteAssistant(assistantId);
    return deleteChatBot(userId, assistant.id);
  }
}
