import { ChatBot } from "@prisma/client";
import { RAGFile, RAGSourceCrawler } from "./i-rag-source-crawler";
import { getWebsiteSource } from "@/lib/db/source";

export class WebsiteSourceCrawler implements RAGSourceCrawler {
  private static _instance: WebsiteSourceCrawler;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async listFiles(
    userId: ChatBot["userId"],
    assistantId: string,
  ): Promise<RAGFile[]> {
    const websiteSource = await getWebsiteSource(userId, assistantId);

    return [];
  }
}
