import { IEmbeddingService } from "./i-embedding-service";
import { OpenAIEmbeddingService } from "./open-ai-embedding-service";
import {
  EmbeddingType,
  RAGFile,
  RAGInsertType,
  RAGQueryResultType,
  RAGQueryType,
} from "./types";
import { ChatBotIdType } from "@/lib/db/types";

export abstract class IRAGService {
  protected embeddingService: IEmbeddingService;

  protected constructor() {
    this.embeddingService = OpenAIEmbeddingService.Instance;
  }

  abstract _insertFiles(
    chatBotId: ChatBotIdType,
    ragFiles: RAGInsertType[],
  ): Promise<{ count: number }>;

  private async embedRAGFile(ragFile: RAGFile): Promise<RAGInsertType> {
    const embedding = await this.embeddingService.embedText(ragFile.content);
    return Object.assign({}, ragFile, { embedding });
  }

  public async insertFiles(
    chatBotId: ChatBotIdType,
    ragFiles: RAGFile[],
  ): Promise<{ count: number }> {
    await this.deleteFiles(chatBotId);

    const embeddedFiles = await Promise.all(
      ragFiles.map((ragFile) => this.embedRAGFile(ragFile)),
    );

    return this._insertFiles(chatBotId, embeddedFiles);
  }

  abstract deleteFiles(chatBotId: ChatBotIdType): Promise<void>;

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
