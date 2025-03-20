import { prisma } from "@/lib/db";
import { UserIdType } from "@/lib/db/types";
import { Prisma } from "@prisma/client";

const userInclude = {
  Subscription: true,
};

export class UserNotFoundException extends Error {}
export class UserAlreadyExistsException extends Error {}

export type GetUserType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export async function getUser(userId: UserIdType) {
  return prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: userInclude,
  });
}

export async function getUserByEmail(email: string, raise: boolean = true) {
  const user = await prisma.user.findFirst({
    where: { email },
    include: userInclude,
  });

  if (raise && (typeof user === "undefined" || !user || user === null)) {
    throw new UserNotFoundException();
  }

  return user;
}

export async function createUser(email: string, passwordHash: string) {
  return prisma.user.create({
    data: { email, password: passwordHash, Usage: { create: {} } },
  });
}
