import { StripeService } from "@/lib/services/stripe-service";
import { BadRequest, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeService = StripeService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
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
  } catch (err) {
    console.error("Error verifying webhook signature:", (err as Error).message);
    throw BadRequest("Webhook signature verification failed");
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await stripeService.createOrUpdateSubscription(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await stripeService.deleteSubscription(subscription);
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    throw BadRequest(`Error handling stripe event: ${error}`);
  }
});
