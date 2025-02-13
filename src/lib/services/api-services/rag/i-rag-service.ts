import { ChatBotIdType } from "@/lib/db/types";
import { IEmbeddingService } from "@/lib/services/api-services/rag/i-embedding-service";
import { OpenAIEmbeddingService } from "@/lib/services/api-services/rag/open-ai-embedding-service";
import {
  RAGInsertType,
  RAGFile,
  EmbeddingType,
  RAGQueryResultType,
  RAGQueryType,
} from "@/lib/services/api-services/rag/types";

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
