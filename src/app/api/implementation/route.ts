import { ChatBotService } from "@/lib/services/chatbot-service";

const chatbotService = ChatBotService.Instance;

export async function GET(request: Request) {
  // const userId = await getUser();
  const userId = "test";

  const cb = await chatbotService.createChatBot(userId, {});
  const s = await chatbotService.createGDriveSource(cb.id, { apiKey: "test" });

  return Response.json({});
}
