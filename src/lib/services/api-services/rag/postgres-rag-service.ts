import {
  insertFile,
  findClosest,
  deleteFiles,
  deleteFilesFromSource,
} from "@/lib/db/pg-rag";
import { ChatBotIdType, UserIdType } from "@/lib/db/types";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import {
  RAGInsertType,
  EmbeddingType,
  RAGQueryResultType,
  InsertionSourceType,
} from "@/lib/services/api-services/rag/types";

export class PostGresRAGService extends IRAGService {
  private static _instance: PostGresRAGService;
  private constructor() {
    super();
  }

  public static async getInstance() {
    if (typeof this._instance !== "undefined") return this._instance;
    this._instance = new this();
    await this._instance.init();
    return this._instance;
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
    chatBotId: ChatBotIdType,
    query: EmbeddingType,
    n?: number,
  ): Promise<RAGQueryResultType[]> {
    return findClosest(chatBotId, query, n);
  }

  async deleteFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
  ): Promise<void> {
    await deleteFiles(chatBotId, userId);
  }

  async deleteFilesFromSource(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    insertionSource: InsertionSourceType,
  ): Promise<void> {
    await deleteFilesFromSource(chatBotId, userId, insertionSource);
  }
}
