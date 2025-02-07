import {
  Prisma,
  SubscriptionTier as PrismaSubscriptionTier,
  User,
} from "@prisma/client";
import { prisma } from ".";
import Stripe from "stripe";
import { UserIdType } from "./types";

export type SubscriptionTier = PrismaSubscriptionTier;

export async function getUserSubscription(userId: UserIdType) {
  return prisma.subscription.findFirstOrThrow({
    where: {
      userId,
    },
  });
}

export async function getUserUsage(userId: UserIdType, throws: boolean = true) {
  const findQuery = { where: { userId } };
  return throws
    ? prisma.usage.findFirstOrThrow(findQuery)
    : prisma.usage.findFirst(findQuery);
}

export async function createOrUpdateUserUsage(
  userId: UserIdType,
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
    where: { subscriptionId: subscription.id },
    create: {
      userId: user.id,
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
