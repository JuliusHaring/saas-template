import { ChatBot } from "@prisma/client";
import {
  getChatBots,
  createChatBot,
  createGDriveSource,
  CreateGDriveSource,
} from "@/lib/db/chatbot";
import { CreateAssistantType, OpenAIService } from "./openai-service";

export class ChatBotService {
  private static _instance: ChatBotService;

  private openAIService!: OpenAIService;

  private constructor() {
    this.openAIService = OpenAIService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getChatBots(userId: ChatBot["userId"]): Promise<ChatBot[]> {
    return getChatBots(userId);
  }

  public async createChatBot(
    userId: ChatBot["userId"],
    assistantName: CreateAssistantType["name"],
    createAssistant?: CreateAssistantType,
  ): Promise<ChatBot> {
    const createAssistantData: CreateAssistantType = Object.assign(
      {},
      createAssistant,
      { name: assistantName },
    );
    const assistant = await this.openAIService.createAssistant(
      userId,
      createAssistantData,
    );
    return createChatBot(userId, assistant.id);
  }

  public async createGDriveSource(
    chatBotId: ChatBot["assistantId"],
    data: CreateGDriveSource,
  ) {
    return createGDriveSource(chatBotId, data);
  }
}
