import { OpenAIService } from "@/lib/services/openai-service";
import { QuotaService, Quota } from "@/lib/services/quotas-service";
import { RAGService } from "@/lib/services/rag/rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/rag/website-source-crawler";
import { auth } from "@clerk/nextjs/server";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService = RAGService.Instance;
const quotaService = QuotaService.Instance;

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const { userId } = await auth();
  const { assistantId } = body;

  const files = await websiteSourceCrawler.listFiles(userId!, assistantId, 5);

  const ingestedFiles = await ragService.ingestRAGFiles(assistantId, files);

  await quotaService.updateUserUsage(
    userId!,
    Quota.MAX_FILES,
    ingestedFiles.length,
  );

  return Response.json(ingestedFiles);
}
