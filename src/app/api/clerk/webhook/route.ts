import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserService } from "@/lib/services/user-service";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as WebhookEvent;

    if (payload.type === "user.created") {
      userService.createOrUpdateUser(payload.data.id);

      return NextResponse.json({ success: true });
    }

    if (payload.type === "user.deleted") {
      await userService.deleteUser(payload.data.id!);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unhandled event" }, { status: 400 });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
