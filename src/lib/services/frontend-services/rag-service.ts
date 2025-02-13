import { ChatBotIdType } from "@/lib/db/types";
import { IngestedFilesResponseType } from "@/lib/services/api-services/rag/types";
import { fetchJson } from "@/lib/utils/fetch";

export class FERAGService {
  private static _instance: FERAGService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async ingestFiles(chatBotId: ChatBotIdType) {
    return fetchJson<IngestedFilesResponseType>(`/api/rag/ingest`, {
      method: "POST",
      body: JSON.stringify({ chatBotId }),
    });
  }
}
