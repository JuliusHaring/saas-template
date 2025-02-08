import { Quota, QuotaService } from "@/lib/api-services/quotas-service";
import { IRAGService } from "@/lib/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/api-services/rag/postgres-rag-service";
import { WebsiteSourceCrawler } from "@/lib/api-services/crawling/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService: IRAGService = PostGresRAGService.Instance;
const quotaService = QuotaService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const userId = await getUserId();

  const { chatBotId } = body;

  let n = await quotaService.getUserQuotaRemainder(userId, Quota.MAX_FILES);
  n = Math.max(0, n);

  const files = await websiteSourceCrawler.listFiles(userId!, chatBotId, n);

  const ingestedFiles = await ragService.insertFiles(chatBotId, files);

  if (ingestedFiles.count > 0) {
    await quotaService.updateUserUsage(
      userId,
      Quota.MAX_FILES,
      ingestedFiles.count,
    );
  }

  return ingestedFiles;
});
