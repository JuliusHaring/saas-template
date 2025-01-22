import { ChatBotService } from "@/lib/services/chatbot-service";

const chatbotService = ChatBotService.Instance;

export async function GET(request: Request) {
  // const userId = await getUser();
  const userId = "test";

  const cb = await chatbotService.createChatBot(userId, "My Assistant");
  const s = await chatbotService.createGDriveSource(cb.assistantId, {
    apiKey: "test",
  });

  return Response.json(s);
}
