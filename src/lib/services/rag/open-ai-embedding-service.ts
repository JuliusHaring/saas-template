import OpenAI from "openai";
import { IEmbeddingService } from "./i-embedding-service";
import { EmbeddingQueryType, EmbeddingType } from "./types";

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

  public async embedText(text: EmbeddingQueryType): Promise<EmbeddingType> {
    return this.client.embeddings
      .create({
        input: text,
        model: "text-embedding-ada-002",
      })
      .then((r) => r.data.map((d) => d.embedding)[0]);
  }
}
