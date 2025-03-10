import { File, Prisma } from "@prisma/client";

export type InsertionIdType = File["insertionId"];

export class RAGFile {
  name: string;
  content: string;
  insertionId!: InsertionIdType;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
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
