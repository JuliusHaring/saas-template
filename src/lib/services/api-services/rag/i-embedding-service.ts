import {
  EmbeddingQueryType,
  EmbeddingType,
} from "@/lib/services/api-services/rag/types";
import { countTokens } from "@/lib/utils/tokens";

export abstract class IEmbeddingService {
  abstract _embedText(text: EmbeddingQueryType): Promise<EmbeddingType>;

  public async embedText(text: EmbeddingQueryType): Promise<EmbeddingType> {
    return this._embedText(text);
  }

  public async embedTexts(
    texts: EmbeddingQueryType[],
  ): Promise<EmbeddingType[]> {
    console.log(
      `Embedding ${texts.reduce((prev, curr) => prev + countTokens(curr), 0)} tokens for ${texts.length} files`,
    );
    return Promise.all(texts.map((text) => this._embedText(text)));
  }
}
