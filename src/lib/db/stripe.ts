import {
  Prisma,
  SubscriptionTier as PrismaSubscriptionTier,
  User,
} from "@prisma/client";
import { prisma } from ".";

export type SubscriptionTier = PrismaSubscriptionTier;

export async function getUserSubscription(userId: User["id"]) {
  return prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
}

export async function getUserUsage(userId: User["id"]) {
  return prisma.usage.findFirstOrThrow({ where: { userId } });
}

export async function createOrUpdateUserUsage(
  userId: User["id"],
  update: Omit<Prisma.UsageCreateInput, "userId">,
) {
  return await prisma.usage.upsert({
    where: { userId },
    update,
    create: { userId, ...update },
  });
}
