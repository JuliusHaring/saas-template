export class RAGFile {
  name: string;
  content: string;
  isSingleFile: boolean = false;

  constructor(name: string, content: string, isSingleFile?: boolean) {
    this.name = name;
    this.content = content;
    this.isSingleFile =
      typeof isSingleFile === "boolean" ? isSingleFile : false;
  }
}

export type RAGInsertType = RAGFile & {
  embedding: EmbeddingType;
};

export type RAGQueryType = string;

export type RAGQueryResultType = RAGInsertType;

export type EmbeddingQueryType = RAGQueryType;
export type EmbeddingType = number[];

export type IngestedFilesResponseType = { count: number };
