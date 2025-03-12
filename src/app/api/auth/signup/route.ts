import { setSession } from "@/lib/auth/session";
import { LoginData } from "@/lib/db/types";
import { UserService } from "@/lib/services/api-services/user-service";
import { NextRequest, NextResponse } from "next/server";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  const loginData: LoginData = await req.json();

  try {
    const user = await userService.signUp(loginData);
    return setSession(req, new NextResponse("User registered"), user.id);
  } catch (e) {
    console.error(e);
    return new NextResponse("E-Mail ist bereits registriert", { status: 400 });
  }
}
