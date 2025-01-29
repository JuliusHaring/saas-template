import {
  Prisma,
  SubscriptionTier as PrismaSubscriptionTier,
  User,
} from "@prisma/client";
import { prisma } from ".";
import Stripe from "stripe";

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

export async function createOrUpdateSubscription(
  email: string,
  subscription: Stripe.Subscription,
  subscriptionTier: SubscriptionTier,
) {
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      tier: subscriptionTier,
      createdAt: new Date(subscription.created * 1000), // Convert from Unix timestamp
      expiresAt: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
    update: {
      tier: subscriptionTier,
      expiresAt: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });
}

export async function deleteSubscription(email: string) {
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  return prisma.subscription.delete({
    where: {
      userId: user.id,
    },
  });
}

export async function hasActiveSubscription(userId: User["id"]) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
  });

  if (!subscription || typeof subscription === "undefined") {
    return false;
  }

  return subscription.expiresAt
    ? subscription.expiresAt.getTime() > Date.now()
    : true;
}
