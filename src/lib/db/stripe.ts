import {
  Prisma,
  SubscriptionTier as PrismaSubscriptionTier,
  Subscription,
  Usage,
} from "@prisma/client";
import { prisma } from ".";

export type SubscriptionTier = PrismaSubscriptionTier;

export async function getUserSubscription(userId: Subscription["userId"]) {
  return prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
}

export async function getUserUsage(userId: Usage["userId"]) {
  return prisma.usage.findFirstOrThrow({ where: { userId } });
}

export async function createOrUpdateUserUsage(
  userId: Usage["userId"],
  update: Omit<Prisma.UsageCreateInput, "userId">,
) {
  return await prisma.usage.upsert({
    where: { userId },
    update,
    create: { userId, ...update },
  });
}
