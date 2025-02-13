import { insertFile, findClosest, deleteDocuments } from "@/lib/db/pg-rag";
import { ChatBotIdType } from "@/lib/db/types";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import {
  RAGInsertType,
  EmbeddingType,
  RAGQueryResultType,
} from "@/lib/services/api-services/rag/types";

export class PostGresRAGService extends IRAGService {
  private static _instance: PostGresRAGService;
  private constructor() {
    super();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async _insertFiles(
    chatBotId: ChatBotIdType,
    ragFiles: RAGInsertType[],
  ): Promise<{ count: number }> {
    return await Promise.all(
      ragFiles.map((rF) => insertFile(chatBotId, rF)),
    ).then((r) => ({ count: r.length }));
  }

  _findClosest(
    query: EmbeddingType,
    n?: number,
  ): Promise<RAGQueryResultType[]> {
    return findClosest(query, n);
  }

  async deleteFiles(chatBotId: ChatBotIdType): Promise<void> {
    await deleteDocuments(chatBotId);
  }
}
