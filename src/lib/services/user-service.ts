import { currentUser, User } from "@clerk/nextjs/server";
import { useClerk } from "@clerk/nextjs";

export class UserNotFoundException extends Error {}

export class UserService {
  private static _instance: UserService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getUser(): Promise<User> {
    return currentUser().then(async (user) => {
      if (user === null) {
        throw new UserNotFoundException();
      }
      return user;
    });
  }
}
