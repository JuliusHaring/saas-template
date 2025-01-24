import { StripeService } from "@/lib/services/stripe-service";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeService = StripeService.Instance;

export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text(); // Parse raw body as text
    event = stripeService.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Error verifying webhook signature:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await stripeService.handleSubscription(subscription);
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error handling Stripe event:", err);
    return NextResponse.json(
      { error: "Error handling event" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
