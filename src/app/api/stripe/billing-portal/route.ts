import { StripeService } from "@/lib/services/api-services/stripe-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { UserService } from "@/lib/services/api-services/user-service";
import { NotFound, withErrorHandling } from "@/lib/utils/routes/http-errors";

const userService = UserService.Instance;
const stripeService = await StripeService.getInstance();

export const POST = withErrorHandling(async () => {
  const userId = await getUserId();

  const user = await userService.getUser(userId);

  if (typeof user.Subscription === "undefined" || user.Subscription === null) {
    throw NotFound(`User ${user.id} has no Subscription`);
  }

  const session = await stripeService.createBillingSession(user);

  return { url: session.url };
});
