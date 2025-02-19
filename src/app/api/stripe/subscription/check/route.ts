import { NextRequest } from "next/server";

import { StripeService } from "@/lib/services/api-services/stripe-service";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";

const stripeService = await StripeService.getInstance();

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await request.json();

  if (!userId) {
    return { hasSubscription: false };
  }

  // Check subscription from the database
  const hasSubscription = await stripeService.hasActiveSubscription(userId);

  return { hasSubscription };
});
