import { prisma } from "@/lib/db";
import { User } from "@prisma/client";

export class UserService {
  private static _instance: UserService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async createOrUpdateUser(id: User["id"], email: User["email"]) {
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

  async deleteUser(id: User["id"]) {
    await prisma.user.delete({
      where: { id },
    });
  }
}
