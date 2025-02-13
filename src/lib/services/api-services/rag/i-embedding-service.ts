import {
  EmbeddingQueryType,
  EmbeddingType,
} from "@/lib/services/api-services/rag/types";

export abstract class IEmbeddingService {
  abstract embedText(text: EmbeddingQueryType): Promise<EmbeddingType>;
}
