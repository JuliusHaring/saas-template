import { Forbidden } from "@/lib/utils/routes/http-errors";
import { auth } from "@clerk/nextjs/server";

export async function getUserId() {
  return auth().then((authValue) => {
    if (authValue.userId === null) {
      throw Forbidden("User not logged in");
    }
    return authValue.userId;
  });
}
