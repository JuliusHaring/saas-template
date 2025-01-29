import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { type NextRequest, NextResponse } from "next/server";

const chatbotService = ChatBotService.Instance;

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  const assistantId = req.nextUrl.searchParams.get("assistantId");

  const chatbotDelete = await chatbotService.deleteChatBot(
    userId,
    assistantId!,
  );

  return NextResponse.json(chatbotDelete);
}
