import { stylesService } from "@/lib/api-services/styles-service";
import { ChatBotIdType, CreateStyleType } from "@/lib/db/types";
import { getUserId } from "@/lib/utils/routes/auth";
import {
  BadRequest,
  NotFound,
  withErrorHandling,
} from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatBotId");

  if (!chatBotId) {
    throw NotFound(`ChatBot ${chatBotId} not found`);
  }

  const style = await stylesService.getStyle(chatBotId);
  if (!style) {
    throw NotFound(`Style not found for user ${chatBotId}`);
  }

  return style;
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId();
  const {
    chatBotId,
    createStyle,
  }: { chatBotId: ChatBotIdType; createStyle: CreateStyleType } =
    await request.json();

  if (!chatBotId) {
    throw BadRequest(`No chatBotId supplied`);
  }

  if (!createStyle) {
    throw BadRequest(`Style not supplied`);
  }

  const updatedStyle = await stylesService.saveStyle(
    userId,
    chatBotId,
    createStyle,
  );
  return updatedStyle;
});
