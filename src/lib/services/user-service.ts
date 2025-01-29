import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import { getUser } from "../db/user";

export class UserService {
  private static _instance: UserService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async getUser(userId: User["id"]) {
    return getUser(userId);
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
