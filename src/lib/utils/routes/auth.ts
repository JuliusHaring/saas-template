import { auth } from "@clerk/nextjs/server";
import { Forbidden } from "./http-errors";
import { isDevModeEnabled } from "../dev-mode";

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
