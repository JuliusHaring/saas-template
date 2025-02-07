import { ChatBot, Prisma, Style, User } from "@prisma/client";

export type CreateChatBotType = Omit<Prisma.ChatBotCreateInput, "User">;

export const chatBotInclude = {
  Style: true,
  GDriveSourceOptions: true,
  WebsiteSourceOptions: true,
  Documents: true,
};

export type ChatBotType = Prisma.ChatBotGetPayload<{
  include: typeof chatBotInclude;
}>;

export type CreateGDriveSourceOptionsType = Omit<
  Prisma.GDriveSourceOptionsCreateInput,
  "ChatBot"
>;

export type CreateWebsiteSourceOptionsType = Omit<
  Prisma.WebsiteSourceOptionsCreateInput,
  "ChatBot"
>;

export type ChatBotIdType = ChatBot["id"];

export type UserIdType = User["id"];

export type StyleCssType = Style["css"];
