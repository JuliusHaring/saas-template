import { IEmbeddingService } from "@/lib/services/api-services/rag/i-embedding-service";
import {
  EmbeddingQueryType,
  EmbeddingType,
} from "@/lib/services/api-services/rag/types";
import {
  NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL,
  OPENAI_SECRET_KEY,
} from "@/lib/utils/environment";
import OpenAI from "openai";

export class OpenAIEmbeddingService extends IEmbeddingService {
  private static _instance: OpenAIEmbeddingService;
  private client: OpenAI;

  private constructor() {
    super();
    this.client = new OpenAI({ apiKey: OPENAI_SECRET_KEY });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async _embedText(text: EmbeddingQueryType): Promise<EmbeddingType> {
    return this.client.embeddings
      .create({
        input: text,
        model: NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL,
      })
      .then((r) => r.data.map((d) => d.embedding)[0]);
  }
}
