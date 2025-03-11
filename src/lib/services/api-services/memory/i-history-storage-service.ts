export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export abstract class IHistoryStorageService {
  protected maxHistorySize: number;
  protected cleanupIntervalMs: number;

  constructor(maxHistorySize: number = 6, cleanupIntervalDays: number = 7) {
    this.maxHistorySize = maxHistorySize;
    this.cleanupIntervalMs = cleanupIntervalDays * 24 * 60 * 60 * 1000;
  }

  private _trimHistory(sessionId: string): void {
    const history = this.getHistory(sessionId);
    this._setHistory(sessionId, history.slice(-this.maxHistorySize));
  }

  /**
   * Adds a message to the chat history.
   */
  protected abstract _addMessage(sessionId: string, message: ChatMessage): void;

  protected abstract _setHistory(
    sessionId: string,
    history: ChatMessage[],
  ): void;

  public addMessage(sessionId: string, message: ChatMessage): void {
    this._trimHistory(sessionId);
    this._addMessage(sessionId, message);
  }

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
