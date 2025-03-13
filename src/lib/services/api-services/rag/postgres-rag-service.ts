import { prisma } from "@/lib/db";
import {
  findClosest,
  deleteFiles,
  deleteFilesFromSource,
  insertFiles,
} from "@/lib/db/pg-rag";
import { ChatBotIdType, UsageType, UserIdType } from "@/lib/db/types";
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
    updateUsage: () => Promise<UsageType>,
  ): Promise<{ count: number }> {
    return prisma.$transaction(
      async (tx) => {
        const res = insertFiles(chatBotId, userId, ragFiles, tx);

        await updateUsage();
        return res;
      },
      { timeout: Number.MAX_SAFE_INTEGER, maxWait: Number.MAX_SAFE_INTEGER },
    );
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
