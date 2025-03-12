import { UserIdType } from "@/lib/db/types";
import {
  Quota,
  QuotaService,
} from "@/lib/services/api-services/quotas-service";
import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { TextService } from "@/lib/services/text-service";

export abstract class RAGSourceCrawler {
  protected textService!: TextService;
  protected ragService!: IRAGService;
  protected quotaService!: QuotaService;

  protected abstract insertionSource: string;

  protected constructor() {}

  protected async init() {
    this.textService = TextService.Instance;
    this.ragService = await PostGresRAGService.getInstance();
    this.quotaService = await QuotaService.getInstance();
  }

  abstract _listFiles(
    userId: UserIdType,
    chatBotId: string,
    n: number,
  ): Promise<{ files: RAGFile[]; limitReached: boolean }>;

  public async listFiles(
    userId: UserIdType,
    chatBotId: string,
  ): Promise<{ files: RAGFile[]; limitReached: boolean }> {
    const remainingFiles = await this.quotaService.getUserQuotaRemainder(
      userId,
      Quota.MAX_FILES,
    );

    await this.ragService.deleteFilesFromSource(
      chatBotId,
      userId,
      this.insertionSource,
    );

    return this._listFiles(userId, chatBotId, remainingFiles).then((res) => {
      res.files.map((f) => (f.insertionSource = this.insertionSource));
      return res;
    });
  }
}
