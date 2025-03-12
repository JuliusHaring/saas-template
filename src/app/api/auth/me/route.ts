import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

  return NextResponse.json({ userId: session.userId });
}
