import { ChatBot } from "@prisma/client";
import { PromptService } from "../prompt-service";
import { IRAGService } from "../rag/i-rag-service";
import { PostGresRAGService } from "../rag/postgres-rag-service";
import { ChatResponseType } from "./types";
import { ChatBotService } from "../chatbot-service";

export abstract class IChatService {
  private promptService: PromptService;
  private ragService: IRAGService;
  private chatbotService: ChatBotService;

  protected defaultNoResponseMessage = ``;
  protected defaultErrorMessage = ``;

  protected constructor() {
    this.promptService = PromptService.Instance;
    this.ragService = PostGresRAGService.Instance;
    this.chatbotService = ChatBotService.Instance;
  }

  abstract _chatWithThread(
    sessionId: string,
    promptMessage: string,
    chatHistory: { role: "user" | "assistant"; content: string }[],
    systemPrompt: string,
  ): Promise<ChatResponseType>;

  public async chatWithThread(
    assistantId: ChatBot["assistantId"],
    sessionId: string,
    userMessage: string,
  ) {
    const sources = await this.ragService.findClosest(userMessage);
    const prompt = this.promptService.generateChatPrompt(sources, userMessage);

    const userId = await this.chatbotService.getUserIdOfChatbot(assistantId);
    const chatbot = await this.chatbotService.getChatBot(userId, assistantId);

    const systemPrompt = this.promptService.generateAssistantPrompt(
      chatbot.instructions,
    );
    return await this._chatWithThread(sessionId, prompt, [], systemPrompt);
  }
}
