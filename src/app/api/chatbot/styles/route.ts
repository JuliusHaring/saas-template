import { stylesService } from "@/lib/services/styles-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatBotId");

  if (!chatBotId) {
    return NextResponse.json({ error: "Missing chatBotId" }, { status: 400 });
  }

  const style = await stylesService.getStyle(chatBotId);
  if (!style) {
    return NextResponse.json({ error: "Style not found" }, { status: 404 });
  }

  return NextResponse.json(style);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  const { chatBotId, css } = await request.json();

  if (!chatBotId || !css) {
    return NextResponse.json(
      { error: "Missing chatBotId or css" },
      { status: 400 },
    );
  }

  const updatedStyle = await stylesService.saveStyle(userId, chatBotId, css);
  return NextResponse.json(updatedStyle);
}
