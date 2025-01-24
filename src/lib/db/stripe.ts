import {
  Subscription,
  SubscriptionTier as PrismaSubscriptionTier,
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
