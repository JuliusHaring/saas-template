import { insertFile, findClosest, deleteFiles } from "@/lib/db/pg-rag";
import { ChatBotIdType, UserIdType } from "@/lib/db/types";
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
    userId: UserIdType,
    ragFiles: RAGInsertType[],
  ): Promise<{ count: number }> {
    return await Promise.all(
      ragFiles.map((rF) => insertFile(chatBotId, userId, rF)),
    ).then((r) => ({ count: r.length }));
  }

  _findClosest(
    query: EmbeddingType,
    n?: number,
  ): Promise<RAGQueryResultType[]> {
    return findClosest(query, n);
  }

  async deleteFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
  ): Promise<void> {
    await deleteFiles(chatBotId, userId);
  }
}
