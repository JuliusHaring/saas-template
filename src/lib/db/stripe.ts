import { SubscriptionTier as PrismaSubscriptionTier } from "@prisma/client";
import { prisma } from ".";
import Stripe from "stripe";
import { UpdateUsageType, UserIdType } from "./types";

export type SubscriptionTier = PrismaSubscriptionTier;

export async function getUserSubscription(userId: UserIdType) {
  return prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
}

export async function getOrCreateUserUsage(userId: UserIdType) {
  return prisma.usage.upsert({
    where: { userId },
    create: {
      chatMessages: 0,
      fileCount: 0,
      User: { connect: { id: userId } },
    },
    update: {},
  });
}

export async function createOrUpdateUserUsage(
  userId: UserIdType,
  update: UpdateUsageType,
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
