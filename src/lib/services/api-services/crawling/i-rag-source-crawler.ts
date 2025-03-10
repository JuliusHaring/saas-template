import { UserIdType } from "@/lib/db/types";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { TextService } from "@/lib/services/api-services/text-service";

export abstract class RAGSourceCrawler {
  protected textService: TextService;

  protected constructor() {
    this.textService = TextService.Instance;
  }

  abstract _listFiles(
    userId: UserIdType,
    chatBotId: string,
  ): Promise<RAGFile[]>;

  public async listFiles(userId: UserIdType, chatBotId: string) {
    return this._listFiles(userId, chatBotId);
  }
}
