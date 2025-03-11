import {
  IHistoryStorageService,
  ChatMessage,
} from "@/lib/services/api-services/memory/i-history-storage-service";

export class InMemoryChatHistoryStorageService extends IHistoryStorageService {
  private static _instance: InMemoryChatHistoryStorageService;
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  private constructor(
    maxHistorySize: number = 5,
    cleanupIntervalDays: number = 7,
  ) {
    super(maxHistorySize, cleanupIntervalDays);
  }

  public static get Instance() {
    const instance = this._instance || (this._instance = new this());
    instance.startCleanupRoutine();
    return instance;
  }

  /**
   * Adds a message to the chat history, ensuring LIFO constraints.
   */
  protected _addMessage(sessionId: string, message: ChatMessage): void {
    if (!this.chatHistory.has(sessionId)) {
      this.chatHistory.set(sessionId, []);
    }

    const sessionHistory = this.chatHistory.get(sessionId)!;
    sessionHistory.push(message);
  }

  protected _setHistory(sessionId: string, history: ChatMessage[]): void {
    this.chatHistory.set(sessionId, history);
  }

  /**
   * Retrieves chat history for a session.
   */
  public getHistory(sessionId: string): ChatMessage[] {
    return this.chatHistory.get(sessionId) || [];
  }

  /**
   * Clears chat history for a session.
   */
  public clearHistory(sessionId: string): void {
    this.chatHistory.delete(sessionId);
  }

  /**
   * Periodically removes stale chat history older than the cleanup threshold.
   */
  protected startCleanupRoutine(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, messages] of this.chatHistory.entries()) {
        this.chatHistory.set(
          sessionId,
          messages.filter(
            (msg) => now - msg.timestamp < this.cleanupIntervalMs,
          ),
        );

        if (this.chatHistory.get(sessionId)?.length === 0) {
          this.chatHistory.delete(sessionId);
        }
      }
    }, this.cleanupIntervalMs);
  }
}
