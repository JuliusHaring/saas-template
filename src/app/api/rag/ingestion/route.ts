import { OpenAIService } from "@/lib/services/openai-service";
import { WebsiteSourceCrawler } from "@/lib/services/rag/website-source-crawler";

const websiteSourceCrawler = WebsiteSourceCrawler.Instance;
const embeddingService = OpenAIService.Instance.embeddings;

export async function GET(request: Request): Promise<Response> {
  const userId = "test";
  const assistantId = "asst_6hG2S7KCwvihuJx0Xxg0Aic2";

  const files = await websiteSourceCrawler.listFiles(userId, assistantId);

  for (const file of files.slice(0, 2)) {
    const embedding = await embeddingService.embedText(file.content);
    const x = 1;
  }

  return Response.json(files);
}
