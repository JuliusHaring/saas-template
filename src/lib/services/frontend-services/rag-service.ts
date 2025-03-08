import { ChatBotIdType } from "@/lib/db/types";
import {
  IngestedFilesResponseType,
  DocumentType,
  DocumentIdType,
} from "@/lib/services/api-services/rag/types";
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

  public async getSingleFiles(chatBotId: ChatBotIdType) {
    return fetchJson<DocumentType[]>(`/api/rag/files/${chatBotId}`);
  }

  public async uploadSingleFile(chatBotId: ChatBotIdType, file: File) {
    const formData = new FormData();
    formData.append("files", file);

    return fetchJson(`/api/rag/files/${chatBotId}`, {
      method: "POST",
      body: formData,
    });
  }

  public async deleteSingleFile(
    chatBotId: ChatBotIdType,
    documentId: DocumentIdType,
  ) {
    return fetchJson<DocumentType>(
      `/api/rag/files/${chatBotId}/${documentId}`,
      { method: "DELETE" },
    );
  }
}
