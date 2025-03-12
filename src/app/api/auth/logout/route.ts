import { clearSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  return clearSession(new NextResponse("Logged out"));
}
