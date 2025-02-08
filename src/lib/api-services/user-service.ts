import { prisma } from "@/lib/db";
import { getUser } from "../db/user";
import { UserIdType } from "../db/types";

export class UserService {
  private static _instance: UserService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async getUser(userId: UserIdType) {
    return getUser(userId);
  }

  async createOrUpdateUser(id: UserIdType, email: UserIdType) {
    return prisma.user.upsert({
      where: { id },
      update: {
        email,
      },
      create: {
        id,
        email,
      },
    });
  }

  async deleteUser(id: UserIdType) {
    await prisma.user.delete({
      where: { id },
    });
  }
}
