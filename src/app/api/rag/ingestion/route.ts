import { OpenAIService } from "@/lib/services/openai-service";
import { RAGService } from "@/lib/services/rag/rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/rag/website-source-crawler";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const ragService = RAGService.Instance;

export async function GET(request: Request): Promise<Response> {
  const userId = "test";
  const assistantId = "asst_6hG2S7KCwvihuJx0Xxg0Aic2";

  const files = await websiteSourceCrawler.listFiles(userId, assistantId);

  const documents = await ragService.ingestRAGFiles(assistantId, files);

  return Response.json(documents);
}
