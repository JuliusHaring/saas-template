import { setSession } from "@/lib/auth/session";
import { LoginData } from "@/lib/db/types";
import { UserService } from "@/lib/services/api-services/user-service";
import { NextRequest, NextResponse } from "next/server";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  const loginData: LoginData = await req.json();

  try {
    const userId = await userService.logIn(loginData);
    return await setSession(
      req,
      new NextResponse("Login erfolgreich."),
      userId,
    );
  } catch (e) {
    console.error(e);
    return new NextResponse("Falsche Anmeldedaten.", { status: 401 });
  }
}
