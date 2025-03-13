import { IEmbeddingService } from "@/lib/services/api-services/rag/i-embedding-service";
import {
  EmbeddingQueryType,
  EmbeddingType,
} from "@/lib/services/api-services/rag/types";
import OpenAI from "openai";

export class OpenAIEmbeddingService extends IEmbeddingService {
  private static _instance: OpenAIEmbeddingService;
  private client: OpenAI;

  private constructor() {
    super();
    this.client = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async _embedText(text: EmbeddingQueryType): Promise<EmbeddingType> {
    return this.client.embeddings
      .create({
        input: text,
        model: process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL!,
      })
      .then((r) => r.data.map((d) => d.embedding)[0]);
  }
}
