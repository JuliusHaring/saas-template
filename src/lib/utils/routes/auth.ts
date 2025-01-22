import { UserNotFoundException } from "@/lib/services/user-service";
import { auth } from "@clerk/nextjs/server";

export async function getUser() {
  return auth().then((authValue) => {
    if (authValue.userId === null) {
      throw new UserNotFoundException();
    }
    return authValue.userId;
  });
}
