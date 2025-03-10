import {
  ChatBot,
  GDriveSource,
  Prisma,
  User,
  WebsiteSource,
  $Enums,
  SubscriptionTier as PrismaSubscriptionTier,
  Subscription,
} from "@prisma/client";

export type CreateChatBotType = Omit<Prisma.ChatBotCreateInput, "User">;

export type UpdateChatBotType = Omit<Prisma.ChatBotUpdateInput, "User">;

export const chatBotInclude = {
  Style: true,
  GDriveSource: true,
  WebsiteSource: true,
  Files: true,
};

export type ChatBotType = Prisma.ChatBotGetPayload<{
  include: typeof chatBotInclude;
}>;

export type CreateGDriveSourceType = Omit<
  Prisma.GDriveSourceCreateInput,
  "ChatBot"
>;

export type CreateWebsiteSourceType = Omit<
  Prisma.WebsiteSourceCreateInput,
  "ChatBot"
>;

export type ChatBotIdType = ChatBot["id"];

export type UserIdType = User["id"];

export type StyleType = Prisma.StyleGetPayload<true>;

export type CreateStyleType = Prisma.StyleCreateInput;

export type WebsiteSourceType = WebsiteSource;

export type GDriveSourceType = GDriveSource;

export type ChatBotSourceType = WebsiteSourceType | GDriveSourceType;

export type UpdateUsageType = Omit<Prisma.UsageCreateInput, "userId" | "User">;

export type SubscriptionType = Subscription;

export type SubscriptionTier = PrismaSubscriptionTier;

export const SubscriptionTierValues = Object.values($Enums.SubscriptionTier);
