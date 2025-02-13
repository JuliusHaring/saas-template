import { isDevModeEnabled } from "@/lib/utils/dev-mode";
import { Forbidden } from "@/lib/utils/routes/http-errors";
import { auth } from "@clerk/nextjs/server";

export async function getUserId() {
  if (isDevModeEnabled()) {
    return "test";
  }

  return auth().then((authValue) => {
    if (authValue.userId === null) {
      throw Forbidden("User not logged in");
    }
    return authValue.userId;
  });
}
