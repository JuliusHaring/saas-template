import {
  createGDriveSourceOptions,
  CreateGDriveSourceOptionsType,
  createWebsiteSourceOptions,
  CreateWebsiteSourceOptionsType,
  getWebsiteSourceOptions,
} from "@/lib/db/chatbot";
import {
  createDocument,
  CreateDocumentType,
  deleteDocuments,
  DocumentType,
  findClosest,
} from "@/lib/db/rag";
import { ChatBot, WebsiteSourceOptions } from "@prisma/client";
import { OpenAIEmbeddingService } from "../openai-service";
import { RAGFile } from "./i-rag-source-crawler";

type CreateDocumentSubsetType = Pick<CreateDocumentType, "name" | "content">;

export class RAGService {
  private static _instance: RAGService;
  private embeddingService: OpenAIEmbeddingService;

  private constructor() {
    this.embeddingService = OpenAIEmbeddingService.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createGDriveSourceOptions(
    assistantId: ChatBot["assistantId"],
    data: CreateGDriveSourceOptionsType,
  ) {
    return createGDriveSourceOptions(assistantId, data);
  }

  public async createWebsiteSourceOptions(
    assistantId: ChatBot["assistantId"],
    data: CreateWebsiteSourceOptionsType,
  ) {
    return createWebsiteSourceOptions(assistantId, data);
  }

  public async getWebsiteSourceOptions(
    assistantId: WebsiteSourceOptions["assistantId"],
    userId: ChatBot["assistantId"],
  ) {
    return getWebsiteSourceOptions(assistantId, userId);
  }

  private async _deleteDocuments(assistantId: ChatBot["assistantId"]) {
    return deleteDocuments(assistantId);
  }

  private async _createDocument(
    assistantId: ChatBot["assistantId"],
    createDocumentData: CreateDocumentSubsetType,
  ) {
    const embedding: number[] = await this.embeddingService
      .embedText(createDocumentData.content)
      .then((arr) => arr[0]);
    const data: CreateDocumentType = Object.assign({}, createDocumentData, {
      vector: embedding,
    });
    return createDocument(assistantId, data);
  }

  private _convertRAGFileToCreateDocumentType(
    ragFile: RAGFile,
  ): CreateDocumentSubsetType {
    return ragFile;
  }

  public async ingestRAGFiles(
    assistantId: ChatBot["assistantId"],
    ragFiles: RAGFile[],
  ) {
    await this._deleteDocuments(assistantId);

    const documents = await Promise.all(
      ragFiles.map((ragFile) =>
        this._createDocument(
          assistantId,
          this._convertRAGFileToCreateDocumentType(ragFile),
        ),
      ),
    );

    return documents;
  }

  public async findClosest(
    text: string,
    n: number = Number.MAX_SAFE_INTEGER,
  ): Promise<DocumentType[]> {
    const embeddings = await this.embeddingService.embedText(text);
    return findClosest(embeddings[0], n);
  }
}
