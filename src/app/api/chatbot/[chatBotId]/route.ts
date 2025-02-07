import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { type NextRequest, NextResponse } from "next/server";

const chatbotService = ChatBotService.Instance;

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  const chatBotId = req.nextUrl.searchParams.get("chatBotId");

  const chatbotDelete = await chatbotService.deleteChatBot(userId, chatBotId!);

  return NextResponse.json(chatbotDelete);
}
