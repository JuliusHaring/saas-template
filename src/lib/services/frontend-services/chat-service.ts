import {
  ChatRequestType,
  ChatResponseType,
} from "@/lib/services/api-services/chat/types";
import { TextService } from "@/lib/services/text-service";
import { fetchJson } from "@/lib/utils/fetch";

export class FEChatService {
  private static _instance: FEChatService;
  private textService = TextService.Instance;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async sendMessage(
    chatRequest: ChatRequestType,
  ): Promise<ChatResponseType> {
    return fetchJson<ChatResponseType>("/api/chatbot/chat", {
      method: "POST",
      body: JSON.stringify(chatRequest),
    }).then((res) => {
      return {
        response: this.textService.convertMarkdownToHtml(res.response),
        sessionId: res.sessionId,
      };
    });
  }
}
