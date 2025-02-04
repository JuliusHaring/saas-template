import { ChatBot } from "@prisma/client";
import { PromptService } from "../prompt-service";
import { IRAGService } from "../rag/i-rag-service";
import { PostGresRAGService } from "../rag/postgres-rag-service";

export abstract class IChatService {
  private promptService: PromptService;
  private ragService: IRAGService;

  protected constructor() {
    this.promptService = PromptService.Instance;
    this.ragService = PostGresRAGService.Instance;
  }

  abstract _chatWithThread(
    assistantId: ChatBot["assistantId"],
    sessionId: string,
    promptMessage: string,
  ): Promise<string>;

  public async chatWithThread(
    assistantId: ChatBot["assistantId"],
    sessionId: string,
    userMessage: string,
  ) {
    const sources = await this.ragService.findClosest(userMessage);
    const prompt = this.promptService.generateChatPrompt(sources, userMessage);

    await this._chatWithThread(assistantId, sessionId, prompt);
  }
}
