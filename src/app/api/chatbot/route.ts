import { ChatBotService } from "@/lib/services/chatbot-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { handleHttpError } from "@/lib/utils/routes/http-errors";
import { NextResponse } from "next/server";

const chatbotService = ChatBotService.Instance;

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const { ...createArgs } = await request.json();

    const chatBot = await chatbotService.createChatBot(userId, createArgs);
    return NextResponse.json(chatBot);
  } catch (error) {
    return handleHttpError(error);
  }
}

export async function GET() {
  const userId = await getUserId();
  const chatBots = await chatbotService.getChatBots(userId);
  return NextResponse.json(chatBots);
}
