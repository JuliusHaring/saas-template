import { Prisma, User } from "@prisma/client";
import { prisma } from ".";

const userInclude = {
  Subscription: true,
};

export type GetUserType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export async function getUser(userId: User["id"]) {
  return prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: userInclude,
  });
}
