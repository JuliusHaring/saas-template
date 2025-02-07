import { stylesService } from "@/lib/services/styles-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatBotId");

  if (!chatBotId) {
    return NextResponse.json({ error: "Missing chatBotId" }, { status: 400 });
  }

  const style = await stylesService.getStyle(chatBotId);
  if (!style) {
    return NextResponse.json({ error: "Style not found" }, { status: 404 });
  }

  return style;
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId();
  const { chatBotId, css } = await request.json();

  if (!chatBotId || !css) {
    return NextResponse.json(
      { error: "Missing chatBotId or css" },
      { status: 400 },
    );
  }

  const updatedStyle = await stylesService.saveStyle(userId, chatBotId, css);
  return updatedStyle;
});
