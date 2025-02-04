import { Quota, QuotaService } from "@/lib/services/quotas-service";
import { IRAGService } from "@/lib/services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/rag/postgres-rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/crawling/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService: IRAGService = PostGresRAGService.Instance;
const quotaService = QuotaService.Instance;

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const userId = await getUserId();
  const { assistantId } = body;

  let n = await quotaService.getUserQuotaRemainder(userId, Quota.MAX_FILES);
  n = Math.max(0, n);

  const files = await websiteSourceCrawler.listFiles(userId!, assistantId, n);

  const ingestedFiles = await ragService.insertFiles(assistantId, files);

  if (ingestedFiles.count > 0) {
    await quotaService.updateUserUsage(
      userId,
      Quota.MAX_FILES,
      ingestedFiles.count,
    );
  }

  return Response.json(ingestedFiles);
}
