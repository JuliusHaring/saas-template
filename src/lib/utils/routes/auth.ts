import { auth } from "@clerk/nextjs/server";
import { Forbidden } from "./http-errors";

export async function getUserId() {
  if (process.env.MODE?.toLowerCase() === "dev") {
    return "test";
  }

  return auth().then((authValue) => {
    if (authValue.userId === null) {
      throw Forbidden("User not logged in");
    }
    return authValue.userId;
  });
}
