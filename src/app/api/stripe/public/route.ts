import { StripeService } from "@/lib/services/api-services/stripe-service";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";

const stripeService = await StripeService.getInstance();

export const GET = withErrorHandling(async () => {
  return stripeService.getProductDescriptions();
});
