import { comparePassword, hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { LoginData, UserIdType } from "@/lib/db/types";
import {
  createUser,
  getUser,
  getUserByEmail,
  UserAlreadyExistsException,
} from "@/lib/db/user";

export class UserService {
  private static _instance: UserService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async getUser(userId: UserIdType) {
    return getUser(userId);
  }

  async logIn(loginData: LoginData) {
    const user = await getUserByEmail(loginData.email);
    const passwordsMatch = await comparePassword(
      loginData.password,
      user!.password,
    );

    if (!passwordsMatch) {
      throw new Error(`Invalid credentials`);
    }
    return user!.id;
  }

  async signUp(loginData: LoginData) {
    const user = await getUserByEmail(loginData.email, false);
    if (!!user) {
      throw new UserAlreadyExistsException();
    }

    const passwordHash = await hashPassword(loginData.password);

    return createUser(loginData.email, passwordHash);
  }
}
