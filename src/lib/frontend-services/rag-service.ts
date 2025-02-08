import { ChatBotIdType } from "../db/types";
import { fetchJson } from "../utils/fetch";

export class FERAGService {
  private static _instance: FERAGService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async ingestFiles(chatBotId: ChatBotIdType) {
    fetchJson(`/api/rag/ingest`, {
      method: "POST",
      body: JSON.stringify({ chatBotId }),
    });
  }
}
