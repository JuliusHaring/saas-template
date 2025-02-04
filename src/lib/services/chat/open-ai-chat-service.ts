import { ChatBot } from "@prisma/client";
import { IChatService } from "./i-chat-service";
import { OpenAI } from "openai";
import { ChatResponseType } from "./types";

export class OpenAIChatService extends IChatService {
  private static _instance: OpenAIChatService;
  private openai: OpenAI;
  private readonly maxHistoryLength = 5;

  private constructor() {
    super();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Trims chat history to avoid excessive token usage.
   */
  private trimChatHistory(
    history: { role: "user" | "assistant"; content: string }[],
  ): {
    role: "user" | "assistant";
    content: string;
  }[] {
    if (history.length > this.maxHistoryLength) {
      return history.slice(-this.maxHistoryLength);
    }
    return history;
  }

  /**
   * Summarizes older chat messages into a single condensed message.
   */
  private async summarizeOldMessages(
    history: { role: "user" | "assistant"; content: string }[],
  ): Promise<string> {
    const summaryPrompt: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "assistant",
        content:
          "Summarize the following conversation while preserving key context:",
      },
      ...history.slice(0, history.length - this.maxHistoryLength),
    ];

    const summaryResponse = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: summaryPrompt,
    });

    return summaryResponse.choices[0].message.content || "";
  }

  /**
   * Handles user chat with a dynamically set system prompt.
   */
  async _chatWithThread(
    sessionId: string,
    promptMessage: string,
    chatHistory: { role: "user" | "assistant"; content: string }[],
    systemPrompt: string,
  ): Promise<ChatResponseType> {
    try {
      let trimmedHistory = this.trimChatHistory(chatHistory);
      let summarizedHistory = "";

      if (chatHistory.length > this.maxHistoryLength) {
        summarizedHistory = await this.summarizeOldMessages(chatHistory);
      }

      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...(summarizedHistory
          ? [
              {
                role: "assistant",
                content: summarizedHistory,
              } as OpenAI.ChatCompletionMessageParam,
            ]
          : []),
        ...trimmedHistory,
        { role: "user", content: promptMessage },
      ];

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages,
      });

      return {
        response:
          response.choices[0].message.content || this.defaultNoResponseMessage,
        sessionId,
      };
    } catch (error) {
      console.error("Error in chat process:", error);
      return {
        response: this.defaultErrorMessage,
        sessionId,
      };
    }
  }
}
