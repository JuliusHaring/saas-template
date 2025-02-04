export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export abstract class IHistoryStorageService {
  protected maxHistoryTokens: number;
  protected cleanupIntervalMs: number;

  constructor(
    maxHistoryTokens: number = 20000,
    cleanupIntervalDays: number = 7,
  ) {
    this.maxHistoryTokens = maxHistoryTokens;
    this.cleanupIntervalMs = cleanupIntervalDays * 24 * 60 * 60 * 1000;
  }

  /**
   * Adds a message to the chat history.
   */
  abstract addMessage(sessionId: string, message: ChatMessage): void;

  /**
   * Retrieves chat history for a session.
   */
  abstract getHistory(sessionId: string): ChatMessage[];

  /**
   * Clears chat history for a session.
   */
  abstract clearHistory(sessionId: string): void;

  /**
   * Periodically cleans up old chat history.
   */
  protected abstract startCleanupRoutine(): void;
}
