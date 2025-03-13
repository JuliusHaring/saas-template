import { getIngestionStatus, setIngestionStatus } from "@/lib/db/chatbot";
import {
  ChatBotIdType,
  IngestionStatusEnum,
  UsageType,
  UserIdType,
} from "@/lib/db/types";
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
import { encoding_for_model, Tiktoken, TiktokenModel } from "tiktoken";

export class InvalidRAGFileException extends Error {
  constructor(ragFile: RAGFile) {
    super(`Invalid RAGFile: ${ragFile.name}`);
  }
}

export abstract class IRAGService {
  protected embeddingService!: IEmbeddingService;
  protected quotaService!: QuotaService;
  protected encoder!: Tiktoken;
  private MAX_TOKENS: number = 8192;

  protected constructor() {}

  protected async init() {
    this.quotaService = await QuotaService.getInstance();
    this.embeddingService = OpenAIEmbeddingService.Instance;
    this.encoder = encoding_for_model(
      process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL! as TiktokenModel,
    );
  }

  abstract _insertFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    ragFiles: RAGInsertType[],
    updateUsage: () => Promise<UsageType>,
  ): Promise<{ count: number }>;

  private async embedRAGFiles(ragFiles: RAGFile[]): Promise<RAGInsertType[]> {
    return Promise.all(
      ragFiles.map(async (ragFile) => {
        return this.embeddingService
          .embedText(ragFile.content)
          .then((embedding) => Object.assign({}, ragFile, { embedding }));
      }),
    );
  }

  public async setIngestionStatus(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    ingestionStatus: IngestionStatusEnum,
  ) {
    return setIngestionStatus(chatBotId, userId, ingestionStatus);
  }

  public async getIngestionStatus(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
  ) {
    return getIngestionStatus(chatBotId, userId);
  }

  public async insertFiles(
    chatBotId: ChatBotIdType,
    userId: UserIdType,
    ragFiles: RAGFile[],
    raiseLimit: boolean,
  ): Promise<{ count: number; limitReached: boolean }> {
    const n = await this.quotaService.getUserQuotaRemainder(
      userId,
      Quota.MAX_FILES,
    );
    let limitReached = false;

    let insertableFiles: RAGFile[] = [];
    for (const file of ragFiles) {
      const chunks = this._splitContent(file);
      insertableFiles.push(...chunks);
    }

    if (raiseLimit && insertableFiles.length > n) {
      throw new QuotaReachedException(Quota.MAX_FILES);
    }

    if (insertableFiles.length > n) {
      limitReached = true;
      insertableFiles = insertableFiles.slice(0, n);
    }

    const embeddedFiles = await this.embedRAGFiles(insertableFiles);

    embeddedFiles.map((f) => {
      if (typeof f.insertionSource === "undefined") {
        throw new InvalidRAGFileException(f);
      }
    });

    const updateUsage = async () =>
      this.quotaService.updateUserUsage(
        userId,
        Quota.MAX_FILES,
        insertableFiles.length,
      );

    const res = await this._insertFiles(
      chatBotId,
      userId,
      embeddedFiles,
      updateUsage,
    );
    return { count: res.count, limitReached };
  }

  private _splitContent(file: RAGFile): RAGFile[] {
    const chunks: RAGFile[] = [];
    const tokens = this.encoder.encode(file.content); // Tokenize content
    const decoder = new TextDecoder("utf-8"); // Convert Uint8Array to string

    for (let i = 0; i < tokens.length; i += this.MAX_TOKENS) {
      const chunkTokens = tokens.slice(i, i + this.MAX_TOKENS);
      const chunkBytes = this.encoder.decode(chunkTokens); // Returns Uint8Array
      const chunkText = decoder.decode(chunkBytes); // Convert to string

      chunks.push(
        new RAGFile(
          `${file.name}_chunk_${chunks.length + 1}`,
          chunkText,
          file.insertionSource,
        ),
      );
    }

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
    chatBotId: ChatBotIdType,
    query: EmbeddingType,
    n?: number,
  ): Promise<RAGQueryResultType[]>;

  public async findClosest(
    chatBotId: ChatBotIdType,
    query: RAGQueryType,
    n?: number,
  ): Promise<RAGQueryResultType[]> {
    const embedding = await this.embeddingService.embedText(query);
    return this._findClosest(chatBotId, embedding, n);
  }
}
