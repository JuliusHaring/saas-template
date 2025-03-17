import { StripeService } from "@/lib/services/api-services/stripe-service";
import { STRIPE_WEBHOOK_SECRET } from "@/lib/utils/environment";
import { BadRequest, withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripeService = await StripeService.getInstance();

export const POST = withErrorHandling(async (request: NextRequest) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    throw BadRequest("Missing signature or webhook secret");
  }

  let event: Stripe.Event;

  try {
    const body = await request.text(); // Parse raw body as text
    event = stripeService.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
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

    return { received: true };
  } catch (error) {
    throw BadRequest(`Error handling stripe event: ${error}`);
  }
});
