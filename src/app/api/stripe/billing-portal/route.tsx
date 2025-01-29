import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/lib/services/stripe-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { UserService } from "@/lib/services/user-service";

const userService = UserService.Instance;

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();

    const user = await userService.getUser(userId);

    const session = await StripeService.Instance.createBillingSession(user);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
