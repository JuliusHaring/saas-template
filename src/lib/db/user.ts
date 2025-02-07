import { Prisma } from "@prisma/client";
import { prisma } from ".";
import { UserIdType } from "./types";

const userInclude = {
  Subscription: true,
};

export type GetUserType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export async function getUser(userId: UserIdType) {
  return prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: userInclude,
  });
}
