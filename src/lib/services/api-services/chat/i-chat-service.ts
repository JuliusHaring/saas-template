import { ChatBotIdType } from "@/lib/db/types";
import { ChatResponseType } from "@/lib/services/api-services/chat/types";
import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { IHistoryStorageService } from "@/lib/services/api-services/memory/i-history-storage-service";
import { InMemoryChatHistoryStorageService } from "@/lib/services/api-services/memory/in-memory-history-storage-service";
import { PromptService } from "@/lib/services/api-services/prompt-service";
import {
  Quota,
  QuotaService,
} from "@/lib/services/api-services/quotas-service";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";

export abstract class IChatService {
  private promptService!: PromptService;
  private ragService!: IRAGService;
  private chatbotService!: ChatBotService;
  private historyStorageService!: IHistoryStorageService;
  private quotaService!: QuotaService;

  protected defaultNoResponseMessage = ``;
  protected defaultErrorMessage = ``;

  protected constructor() {}

  protected async init() {
    this.promptService = PromptService.Instance;
    this.ragService = await PostGresRAGService.getInstance();
    this.chatbotService = ChatBotService.Instance;
    this.historyStorageService = InMemoryChatHistoryStorageService.Instance;
    this.quotaService = await QuotaService.getInstance();
  }

  abstract _chatWithThread(
    sessionId: string,
    promptMessage: string,
    chatHistory: { role: "user" | "assistant"; content: string }[],
    systemPrompt: string,
  ): Promise<ChatResponseType>;

  public async chatWithThread(
    chatBotId: ChatBotIdType,
    sessionId: string,
    userMessage: string,
  ) {
    await this.quotaService.getChatBotQuotaRemainder(
      chatBotId,
      Quota.MAX_CHAT_MESSAGES,
    );

    await this.quotaService.updateChatbotUsage(
      chatBotId,
      Quota.MAX_CHAT_MESSAGES,
      1,
    );

    const sources = await this.ragService.findClosest(userMessage);
    const prompt = this.promptService.generateChatPrompt(sources, userMessage);

    const userId = await this.chatbotService.getUserIdOfChatbot(chatBotId);
    const chatbot = await this.chatbotService.getChatBot(userId, chatBotId);

    const systemPrompt = this.promptService.generateChatBotPrompt(
      chatbot.instructions,
    );

    const preCalculationTimestamp = Date.now();

    const answer = await this._chatWithThread(
      sessionId,
      prompt,
      this.historyStorageService.getHistory(sessionId),
      systemPrompt,
    );

    this.historyStorageService.addMessage(sessionId, {
      role: "user",
      content: prompt,
      timestamp: preCalculationTimestamp,
    });

    this.historyStorageService.addMessage(sessionId, {
      role: "assistant",
      content: answer.response,
      timestamp: Date.now(),
    });

    return answer.response;
  }
}
