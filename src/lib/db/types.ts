import {
  ChatBot,
  GDriveSource,
  Prisma,
  Style,
  User,
  WebsiteSource,
} from "@prisma/client";

export type CreateChatBotType = Omit<Prisma.ChatBotCreateInput, "User">;

export const chatBotInclude = {
  Style: true,
  GDriveSource: true,
  WebsiteSource: true,
  Documents: true,
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

export type StyleCssType = Style["css"];

export type ChatBotSourceType = WebsiteSource | GDriveSource;

export type UpdateUsageType = Omit<Prisma.UsageCreateInput, "userId" | "User">;
