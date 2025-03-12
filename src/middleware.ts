import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/chatbot-ui") ||
    pathname.startsWith("/api/chatbot/integrate")
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/admin") &&
    !["/admin/auth/login", "/admin/auth/signup"].includes(pathname)
  ) {
    const session = await getSession(req);
    if (!session.userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
