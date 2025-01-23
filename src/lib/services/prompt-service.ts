import { DocumentType } from "@/lib/db/rag";

export class PromptService {
  private static _instance: PromptService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  generateChatPrompt(sources: DocumentType[], userMessage: string): string {
    const prompt = `
  USER_MESSAGE: ${userMessage}
  -------------------
  SOURCES:
  ${sources.map((source) => source.content).join("\n\n-----------\n\n")}
    `;

    return prompt.trim();
  }
}
