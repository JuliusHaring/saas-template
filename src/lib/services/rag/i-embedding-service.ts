import { EmbeddingQueryType, EmbeddingType } from "./types";

export abstract class IEmbeddingService {
  abstract embedText(text: EmbeddingQueryType): Promise<EmbeddingType>;
}
