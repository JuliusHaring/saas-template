import { IChatService } from "@/lib/services/api-services/chat/i-chat-service";
import { ChatResponseType } from "@/lib/services/api-services/chat/types";
import {
  NEXT_PUBLIC_OPENAI_CHAT_COMPLETION_MODEL,
  OPENAI_SECRET_KEY,
} from "@/lib/utils/environment";
import OpenAI from "openai";

export class OpenAIChatService extends IChatService {
  private static _instance: OpenAIChatService;
  private openai: OpenAI;

  private constructor() {
    super();
    this.openai = new OpenAI({ apiKey: OPENAI_SECRET_KEY });
  }

  public static async getInstance() {
    if (typeof this._instance !== "undefined") return this._instance;

    this._instance = new this();
    await this._instance.init();
    return this._instance;
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
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: promptMessage },
      ];

      const response = await this.openai.chat.completions.create({
        model: NEXT_PUBLIC_OPENAI_CHAT_COMPLETION_MODEL,
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
