import { NextRequest } from "next/server";

import { UserService } from "@/lib/services/api-services/user-service";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";

const userService = UserService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { userId } = await request.json();

  const user = await userService.getUser(userId);

  return { email: user.email };
});
