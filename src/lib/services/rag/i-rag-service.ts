import { ChatBot } from "@prisma/client";
import { IEmbeddingService } from "./i-embedding-service";
import { OpenAIEmbeddingService } from "./open-ai-embedding-service";
import {
  EmbeddingType,
  RAGFile,
  RAGInsertType,
  RAGQueryResultType,
  RAGQueryType,
} from "./types";

export abstract class IRAGService {
  protected embeddingService: IEmbeddingService;

  protected constructor() {
    this.embeddingService = OpenAIEmbeddingService.Instance;
  }

  abstract _insertFiles(
    assistantId: ChatBot["assistantId"],
    ragFiles: RAGInsertType[],
  ): Promise<{ count: number }>;

  private async embedRAGFile(ragFile: RAGFile): Promise<RAGInsertType> {
    const embedding = await this.embeddingService.embedText(ragFile.content);
    return Object.assign({}, ragFile, { embedding });
  }

  public async insertFiles(
    assistantId: ChatBot["assistantId"],
    ragFiles: RAGFile[],
  ): Promise<{ count: number }> {
    await this.deleteFiles(assistantId);

    const embeddedFiles = await Promise.all(ragFiles.map(this.embedRAGFile));

    return this._insertFiles(assistantId, embeddedFiles);
  }

  abstract deleteFiles(assistantId: ChatBot["assistantId"]): Promise<void>;

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
