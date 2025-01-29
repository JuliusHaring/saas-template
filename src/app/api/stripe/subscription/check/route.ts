import { NextRequest, NextResponse } from "next/server";

import { StripeService } from "@/lib/services/stripe-service";

const stripeService = StripeService.Instance;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ hasSubscription: false });
    }

    // Check subscription from the database
    const hasSubscription = await stripeService.hasActiveSubscription(userId);

    return NextResponse.json({ hasSubscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ hasSubscription: false }, { status: 500 });
  }
}
