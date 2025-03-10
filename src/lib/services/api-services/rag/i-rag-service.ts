import { ChatBotIdType, UserIdType } from "@/lib/db/types";
import {
  Quota,
  QuotaReachedException,
  QuotaService,
} from "@/lib/services/api-services/quotas-service";
import { IEmbeddingService } from "@/lib/services/api-services/rag/i-embedding-service";
import { OpenAIEmbeddingService } from "@/lib/services/api-services/rag/open-ai-embedding-service";
import {
  RAGInsertType,
  RAGFile,
  EmbeddingType,
  RAGQueryResultType,
  RAGQueryType,
  InsertionSourceType,
} from "@/lib/services/api-services/rag/types";

export class InvalidRAGFileException extends Error {
  constructor(ragFile: RAGFile) {
    super(`Invalid RAGFile: ${ragFile.name}`);
  }
}

export abstract class IRAGService {
  protected embeddingService!: IEmbeddingService;
  protected quotaService!: QuotaService;
  private MAX_CHUNK_LENGTH: number = 6000;

  protected constructor() {}

  protected async init() {
    this.quotaService = await QuotaService.getInstance();
    this.embeddingService = OpenAIEmbeddingService.Instance;
  }

  abstract _insertFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    ragFiles: RAGInsertType[],
  ): Promise<{ count: number }>;

  private async embedRAGFile(ragFile: RAGFile): Promise<RAGInsertType> {
    const embedding = await this.embeddingService.embedText(ragFile.content);
    return Object.assign({}, ragFile, { embedding });
  }

  public async insertFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    ragFiles: RAGFile[],
  ): Promise<{ count: number }> {
    const n = await this.quotaService.getUserQuotaRemainder(
      userId,
      Quota.MAX_FILES,
    );

    const splitFiles: RAGFile[] = [];
    for (const file of ragFiles) {
      const chunks = this._splitContent(file);
      splitFiles.push(...chunks);
    }

    if (splitFiles.length > n) {
      throw new QuotaReachedException(Quota.MAX_FILES);
    }

    await this.quotaService.updateUserUsage(
      userId,
      Quota.MAX_FILES,
      splitFiles.length,
    );

    const embeddedFiles = await Promise.all(
      splitFiles.map((ragFile) => this.embedRAGFile(ragFile)),
    );

    embeddedFiles.map((f) => {
      if (typeof f.insertionSource === "undefined") {
        throw new InvalidRAGFileException(f);
      }
    });

    return this._insertFiles(chatBotId, userId, embeddedFiles);
  }

  private _splitContent(file: RAGFile): RAGFile[] {
    const chunks: RAGFile[] = [];
    const parts =
      file.content.match(new RegExp(`.{1,${this.MAX_CHUNK_LENGTH}}`, "gs")) ||
      [];

    parts.forEach((part, index) => {
      chunks.push(
        new RAGFile(
          `${file.name}_chunk_${index + 1}`,
          part,
          file.insertionSource,
        ),
      );
    });

    return chunks;
  }

  abstract deleteFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
  ): Promise<void>;

  abstract deleteFilesFromSource(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    insertionSource: InsertionSourceType,
  ): Promise<void>;

  abstract _findClosest(
    query: EmbeddingType,
    n?: number,
  ): Promise<RAGQueryResultType[]>;

  public async findClosest(
    query: RAGQueryType,
    n?: number,
  ): Promise<RAGQueryResultType[]> {
    const embedding = await this.embeddingService.embedText(query);
    return this._findClosest(embedding, n);
  }
}
