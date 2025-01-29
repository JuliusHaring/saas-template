import { NextRequest, NextResponse } from "next/server";

import { UserService } from "@/lib/services/user-service";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const user = await userService.getUser(userId);

    return NextResponse.json({ email: user.email });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ hasSubscription: false }, { status: 500 });
  }
}
