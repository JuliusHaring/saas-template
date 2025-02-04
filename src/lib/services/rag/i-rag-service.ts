import { ChatBot } from "@prisma/client";
import { IEmbeddingService } from "./i-embedding-service";
import { OpenAIEmbeddingService } from "./open-ai-embedding-service";
import {
  EmbeddingType,
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
  ): Promise<void>;

  public async insertFiles(
    assistantId: ChatBot["assistantId"],
    ragFiles: RAGInsertType[],
  ): Promise<void> {
    await this.deleteFiles(assistantId);

    await this._insertFiles(assistantId, ragFiles);
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
