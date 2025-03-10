import { IRAGService } from "@/lib/services/api-services/rag/i-rag-service";
import { PostGresRAGService } from "@/lib/services/api-services/rag/postgres-rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/api-services/crawling/website-source-crawler";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import { IngestedFilesResponseType } from "@/lib/services/api-services/rag/types";

const websiteSourceCrawler = await WebsiteSourceCrawler.getInstance();
const ragService: IRAGService = await PostGresRAGService.getInstance();

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const userId = await getUserId();

  const { chatBotId } = body;

  const files = await websiteSourceCrawler.listFiles(userId!, chatBotId);

  const ingestedFiles = await ragService.insertFiles(chatBotId, userId, files);

  return ingestedFiles as IngestedFilesResponseType;
});
