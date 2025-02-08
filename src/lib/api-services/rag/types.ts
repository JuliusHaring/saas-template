export class RAGFile {
  name: string;
  content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

export type RAGInsertType = RAGFile & {
  embedding: EmbeddingType;
};

export type RAGQueryType = string;

export type RAGQueryResultType = RAGInsertType;

export type EmbeddingQueryType = RAGQueryType;
export type EmbeddingType = number[];
