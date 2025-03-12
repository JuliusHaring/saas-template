import { setSession } from "@/lib/auth/session";
import { LoginData } from "@/lib/db/types";
import { UserService } from "@/lib/services/api-services/user-service";
import { NextRequest, NextResponse } from "next/server";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  const loginData: LoginData = await req.json();

  try {
    const userId = await userService.logIn(loginData);
    return setSession(req, new NextResponse("Login successful"), userId);
  } catch (e) {
    console.error(e);
    return new NextResponse("Invalid credentials", { status: 401 });
  }
}
