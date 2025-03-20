import {
  UserIdType,
  SubscriptionType,
  UpdateUsageType,
  UsageType,
} from "@/lib/db/types";
import { SubscriptionTier } from "@prisma/client";
import { prisma } from ".";
import Stripe from "stripe";

export async function getUserSubscription(
  userId: UserIdType,
): Promise<SubscriptionType> {
  return prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
}

export async function getUsage(userId: UserIdType) {
  const usage = await prisma.usage.findFirstOrThrow({ where: { userId } });

  const lastReset = usage.lastResetAt;
  const now = new Date();

  // Check if a new subscription month started
  const resetNeeded =
    lastReset.getUTCFullYear() !== now.getUTCFullYear() ||
    lastReset.getUTCMonth() !== now.getUTCMonth();

  if (resetNeeded) {
    return prisma.usage.update({
      where: { userId },
      data: { chatMessages: 0, fileCount: 0, lastResetAt: now },
    });
  }

  return usage;
}

export async function createOrUpdateUserUsage(
  userId: UserIdType,
  update: UpdateUsageType,
): Promise<UsageType> {
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
    where: { subscriptionId: subscription.id },
    create: {
      User: { connect: { id: user.id } },
      subscriptionId: subscription.id,
      customerId: subscription.customer as string,
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

export async function hasActiveSubscription(userId: UserIdType) {
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
