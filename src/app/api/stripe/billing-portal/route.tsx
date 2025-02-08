import { StripeService } from "@/lib/api-services/stripe-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { UserService } from "@/lib/api-services/user-service";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";

const userService = UserService.Instance;

export const POST = withErrorHandling(async () => {
  const userId = await getUserId();

  const user = await userService.getUser(userId);

  const session = await StripeService.Instance.createBillingSession(user);

  return { url: session.url };
});
