import { TextService } from "../text-service";
import { RAGFile } from "../rag/types";
import { UserIdType } from "@/lib/db/types";

export abstract class RAGSourceCrawler {
  protected textService: TextService;

  private MAX_CHUNK_LENGTH: number = 6000;

  protected constructor() {
    this.textService = TextService.Instance;
  }

  abstract _listFiles(
    userId: UserIdType,
    chatBotId: string,
    n: number,
  ): Promise<RAGFile[]>;

  public async listFiles(userId: UserIdType, chatBotId: string, n: number) {
    const rawFiles = await this._listFiles(userId, chatBotId, n);

    // Split files into smaller chunks if needed
    const splitFiles: RAGFile[] = [];
    for (const file of rawFiles) {
      const chunks = this.splitContent(file.content, this.MAX_CHUNK_LENGTH);
      chunks.forEach((chunk, index) =>
        splitFiles.push(
          new RAGFile(`${file.name}_chunk_${index + 1}`, chunk.content),
        ),
      );
    }

    return splitFiles.splice(0, n);
  }

  private splitContent(content: string, maxLength: number): RAGFile[] {
    const chunks: RAGFile[] = [];
    const parts = content.match(new RegExp(`.{1,${maxLength}}`, "gs")) || [];

    parts.forEach((part, index) => {
      chunks.push(new RAGFile(`part_${index + 1}`, part));
    });

    return chunks;
  }
}
