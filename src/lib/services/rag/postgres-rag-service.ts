import { ChatBot } from "@prisma/client";
import { IRAGService } from "./i-rag-service";
import { findClosest, deleteDocuments, insertFile } from "@/lib/db/pg-rag";
import { EmbeddingType, RAGInsertType, RAGQueryResultType } from "./types";

export class PostGresRAGService extends IRAGService {
  private static _instance: PostGresRAGService;
  private constructor() {
    super();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async _insertFiles(
    assistantId: ChatBot["assistantId"],
    ragFiles: RAGInsertType[],
  ): Promise<void> {
    await Promise.all(ragFiles.map((rF) => insertFile(assistantId, rF)));
  }

  _findClosest(query: EmbeddingType): Promise<RAGQueryResultType[]> {
    return findClosest(query);
  }

  async deleteFiles(assistantId: ChatBot["assistantId"]): Promise<void> {
    await deleteDocuments(assistantId);
  }
}
