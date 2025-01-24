import { Quota, QuotaService } from "@/lib/services/quotas-service";
import { RAGService } from "@/lib/services/rag/rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/rag/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService = RAGService.Instance;
const quotaService = QuotaService.Instance;

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const userId = await getUserId();
  const { assistantId } = body;

  let n = await quotaService.getUserQuotaRemainder(userId, Quota.MAX_FILES);
  n = Math.max(0, n);

  const files = await websiteSourceCrawler.listFiles(userId!, assistantId, n);

  const ingestedFiles = await ragService.ingestRAGFiles(assistantId, files);

  await quotaService.updateUserUsage(
    userId,
    Quota.MAX_FILES,
    ingestedFiles.length,
  );

  return Response.json(ingestedFiles);
}
