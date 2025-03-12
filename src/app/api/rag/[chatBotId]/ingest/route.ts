import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/api-services/crawling/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import { IngestedFilesResponseType } from "@/lib/services/api-services/rag/types";
import { IngestionStatusEnum } from "@/lib/db/types";
import { QuotaReachedException } from "@/lib/services/api-services/quotas-service";

const websiteSourceCrawler = await WebsiteSourceCrawler.getInstance();
const ragService: IRAGService = await PostGresRAGService.getInstance();

export const POST = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ chatBotId: string }> },
  ) => {
    const userId = await getUserId();
    const chatBotId = (await params).chatBotId;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), 55000),
    );

    try {
      return await Promise.race([
        (async () => {
          await ragService.setIngestionStatus(
            chatBotId,
            userId,
            IngestionStatusEnum.RUNNING,
          );

          const files = await websiteSourceCrawler.listFiles(
            userId!,
            chatBotId,
          );
          const ingestedFiles = await ragService.insertFiles(
            chatBotId,
            userId,
            files,
          );

          await ragService.setIngestionStatus(
            chatBotId,
            userId,
            IngestionStatusEnum.READY,
          );

          return ingestedFiles as IngestedFilesResponseType;
        })(),
        timeoutPromise,
      ]);
    } catch (e) {
      if (e instanceof QuotaReachedException) {
        await ragService.setIngestionStatus(
          chatBotId,
          userId,
          IngestionStatusEnum.LIMITED,
        );
      } else {
        await ragService.setIngestionStatus(
          chatBotId,
          userId,
          IngestionStatusEnum.ABORTED,
        );
      }
      throw e;
    }
  },
);
