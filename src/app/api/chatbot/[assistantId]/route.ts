import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NextResponse } from "next/server";

const chatbotService = ChatBotService.Instance;

export async function DELETE(
  req: Request,
  { params }: { params: { assistantId: string } },
) {
  const userId = await getUserId();
  const { assistantId } = await params;

  const chatbotDelete = await chatbotService.deleteChatBot(userId, assistantId);

  return NextResponse.json(chatbotDelete);
}
