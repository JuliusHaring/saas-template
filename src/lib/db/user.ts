import { prisma } from "@/lib/db";
import { UserIdType } from "@/lib/db/types";
import { Prisma } from "@prisma/client";

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
