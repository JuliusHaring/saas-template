import { stylesService } from "@/lib/services/styles-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const assistantId = url.searchParams.get("assistantId");

  if (!assistantId) {
    return NextResponse.json({ error: "Missing assistantId" }, { status: 400 });
  }

  const style = await stylesService.getStyle(assistantId);
  if (!style) {
    return NextResponse.json({ error: "Style not found" }, { status: 404 });
  }

  return NextResponse.json(style);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  const { assistantId, css } = await request.json();

  if (!assistantId || !css) {
    return NextResponse.json(
      { error: "Missing assistantId or css" },
      { status: 400 },
    );
  }

  const updatedStyle = await stylesService.saveStyle(userId, assistantId, css);
  return NextResponse.json(updatedStyle);
}
