import { PromptService } from "../prompt-service";
import { IRAGService } from "../rag/i-rag-service";
import { PostGresRAGService } from "../rag/postgres-rag-service";
import { ChatResponseType } from "./types";
import { ChatBotService } from "../chatbot-service";
import { InMemoryChatHistoryStorageService } from "../memory/in-memory-history-storage-service";
import { IHistoryStorageService } from "../memory/i-history-storage-service";
import { ChatBotIdType } from "@/lib/db/types";

export abstract class IChatService {
  private promptService: PromptService;
  private ragService: IRAGService;
  private chatbotService: ChatBotService;
  private historyStorageService: IHistoryStorageService;

  protected defaultNoResponseMessage = ``;
  protected defaultErrorMessage = ``;

  protected constructor() {
    this.promptService = PromptService.Instance;
    this.ragService = PostGresRAGService.Instance;
    this.chatbotService = ChatBotService.Instance;
    this.historyStorageService = InMemoryChatHistoryStorageService.Instance;
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
