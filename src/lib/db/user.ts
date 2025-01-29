import { User } from "@prisma/client";
import { prisma } from ".";

export async function getUser(userId: User["id"]) {
  return prisma.user.findFirstOrThrow({ where: { id: userId } });
}
