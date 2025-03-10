import { UserIdType } from "@/lib/db/types";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { TextService } from "@/lib/services/text-service";

export abstract class RAGSourceCrawler {
  protected textService!: TextService;
  protected ragService!: IRAGService;

  protected constructor() {}

  protected async init() {
    this.textService = TextService.Instance;
    this.ragService = await PostGresRAGService.getInstance();
  }

  abstract _listFiles(
    userId: UserIdType,
    chatBotId: string,
  ): Promise<RAGFile[]>;

  public async listFiles(
    userId: UserIdType,
    chatBotId: string,
  ): Promise<RAGFile[]> {
    const insertionSource = this.constructor.name;

    await this.ragService.deleteFilesFromSource(
      chatBotId,
      userId,
      insertionSource,
    );

    return this._listFiles(userId, chatBotId).then((files) => {
      files.map((f) => (f.insertionSource = insertionSource));
      return files;
    });
  }
}
