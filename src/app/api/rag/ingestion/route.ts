import { ChatBotService } from "@/lib/services/chatbot-service";
import { OpenAIService } from "@/lib/services/openai-service";
import { RAGService } from "@/lib/services/rag/rag-service";
import { WebsiteSourceCrawler } from "@/lib/services/rag/website-source-crawler";

const chatbotService = ChatBotService.Instance;
const ragService = RAGService.Instance;
const openaiService = OpenAIService.Instance;

export async function GET(request: Request): Promise<Response> {
  const userId = "test";
  const assistantId = "asst_6hG2S7KCwvihuJx0Xxg0Aic2";

  const websiteSourceCrawler = WebsiteSourceCrawler.Instance;

  const websiteSourceOptions = await ragService.getWebsiteSourceOptions(
    assistantId,
    userId,
  );

  const files = await websiteSourceCrawler.listFiles(userId, assistantId);

  return Response.json(files);
}
