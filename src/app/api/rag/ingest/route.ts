import {
  Quota,
  QuotaNotFoundException,
  QuotaService,
} from "@/lib/services/quotas-service";
import { IRAGService } from "@/lib/services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/rag/postgres-rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/crawling/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";
import { BadRequest, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService: IRAGService = PostGresRAGService.Instance;
const quotaService = QuotaService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const userId = await getUserId();

  const { chatBotId } = body;

  let n;
  try {
    n = await quotaService.getUserQuotaRemainder(userId, Quota.MAX_FILES);
    n = Math.max(0, n);
  } catch (e) {
    if (e instanceof QuotaNotFoundException) {
      throw BadRequest(`Quota for user ${userId} not found`);
    }
    throw BadRequest();
  }

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
