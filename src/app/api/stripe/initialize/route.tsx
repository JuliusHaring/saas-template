// app/api/stripe/route.ts
import { NextResponse } from "next/server";
import { StripeService } from "@/lib/services/api-services/stripe-service";

export async function POST() {
  await StripeService.Instance.init();
  return NextResponse.json({ success: true });
}
