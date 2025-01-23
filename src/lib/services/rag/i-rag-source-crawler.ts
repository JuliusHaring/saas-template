import { ChatBot } from "@prisma/client";

export class RAGFile {
  name: string;
  content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

export interface RAGSourceCrawler {
  listFiles(userId: ChatBot["userId"], assistantId: string): Promise<RAGFile[]>;
}
