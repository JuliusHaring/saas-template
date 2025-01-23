import { ChatBot } from "@prisma/client";
import { TextService } from "../text-service";

export class RAGFile {
  name: string;
  content: string;

  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
}

export interface RAGSourceCrawler {
  textService: TextService;
  listFiles(userId: ChatBot["userId"], assistantId: string): Promise<RAGFile[]>;
}
