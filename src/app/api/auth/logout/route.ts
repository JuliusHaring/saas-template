import { clearSession } from "@/lib/auth/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return clearSession(request);
}
