import { getSession } from "@/lib/auth/session";
import { Forbidden } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

export async function getUserId(req: NextRequest): Promise<string> {
  const session = await getSession(req);

  if (!session?.userId) {
    throw Forbidden("User is not logged in");
  }

  return session.userId;
}
