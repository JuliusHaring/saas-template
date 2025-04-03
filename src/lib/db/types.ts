import {
  Prisma,
  User,
  $Enums,
  SubscriptionTier as PrismaSubscriptionTier,
  Subscription,
} from "@prisma/client";

export type UserType = User;
export type UserIdType = User["id"];

export type LoginData = {
  email: User["email"];
  password: User["password"];
};



export type SubscriptionType = Subscription;

export type SubscriptionTier = PrismaSubscriptionTier;

export const SubscriptionTierValues = Object.values($Enums.SubscriptionTier);

export type BatchPayload = Prisma.BatchPayload;

export { IngestionStatus as IngestionStatusEnum } from "@prisma/client";
