import {
  ChatBotType,
  createChatBot,
  CreateChatBotType,
  deleteChatBot,
  getChatBot,
  getChatBots,
  getUserIdOfChatbot,
} from "@/lib/db/chatbot";
import { ChatBot } from "@prisma/client";
import { CreateAssistantType, OpenAIService } from "./openai-service";

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
  ): Promise<ChatBot["userId"]> {
    return getUserIdOfChatbot(assistantId);
  }

  public async getChatBot(
    userId: ChatBot["userId"],
    assistantId: ChatBot["assistantId"],
  ) {
    return getChatBot(userId, assistantId);
  }

  public async getChatBots(userId: ChatBot["userId"]): Promise<ChatBot[]> {
    return getChatBots(userId);
  }

  public async createChatBot(
    userId: ChatBot["userId"],
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
    userId: ChatBot["userId"],
    assistantId: ChatBot["assistantId"],
  ) {
    const assistant = await this.openAIService.deleteAssistant(assistantId);
    return deleteChatBot(userId, assistant.id);
  }
}
