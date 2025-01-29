import { prisma } from "@/lib/db";
import { User } from "@prisma/client";

export class UserService {
  private static _instance: UserService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async createOrUpdateUser(id: User["id"]) {
    return prisma.user.upsert({
      where: { id },
      update: {},
      create: {
        id,
        stripeCustomerId: null,
      },
    });
  }

  async deleteUser(id: User["id"]) {
    await prisma.user.delete({
      where: { id },
    });
  }
}
