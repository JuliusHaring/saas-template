import { File, Prisma } from "@prisma/client";

export type InsertionSourceType = File["insertionSource"];

export class RAGFile {
  name: string;
  content: string;
  insertionSource!: InsertionSourceType;

  constructor(
    name: string,
    content: string,
    insertionSource: InsertionSourceType | undefined = undefined,
  ) {
    this.name = name;
    this.content = content;

    if (typeof insertionSource !== "undefined")
      this.insertionSource = insertionSource;
  }
}

export type RAGFileType = Omit<RAGFile, "complete" | "isComplete">;

export type RAGInsertType = RAGFile & {
  embedding: EmbeddingType;
};

export type RAGQueryType = string;

export type RAGQueryResultType = RAGFileType;

export type EmbeddingQueryType = RAGQueryType;
export type EmbeddingType = number[];

export type IngestedFilesResponseType = { count: number };

export type FileType = File;

export type FileIdType = File["id"];

export type FileWithEmbeddingType = File & { distance: number };

export type CreateFileType = Omit<Prisma.FileCreateInput, "ChatBot"> & {
  embedding: EmbeddingType;
};
