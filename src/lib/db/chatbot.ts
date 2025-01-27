import { ChatBot, Prisma, WebsiteSourceOptions } from "@prisma/client";
import { prisma } from ".";

export const chatBotInclude = {
  Style: true,
  GDriveSourceOptions: true,
  WebsiteSourceOptions: true,
  Documents: true,
};

export type CreateChatBotType = Omit<Prisma.ChatBotCreateInput, "userId">;

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

export async function getUserIdOfChatbot(assistantId: ChatBot["assistantId"]) {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { assistantId },
    })
    .then((chatbot) => chatbot.userId);
}

export async function getChatBot(
  userId: ChatBot["userId"],
  assistantId: ChatBot["assistantId"],
) {
  return prisma.chatBot.findFirstOrThrow({
    where: { assistantId, userId },
  });
}

export async function getChatBots(
  userId: ChatBot["userId"],
): Promise<ChatBotType[]> {
  return prisma.chatBot.findMany({
    where: {
      userId: userId,
    },
    include: chatBotInclude,
  });
}

export async function createChatBot(
  userId: ChatBot["userId"],
  createChatBot: CreateChatBotType,
): Promise<ChatBotType> {
  return prisma.chatBot.create({
    data: {
      userId,
      ...createChatBot,
    },
    include: chatBotInclude,
  });
}

export async function deleteChatBot(
  userId: ChatBot["userId"],
  assistantId: ChatBot["assistantId"],
): Promise<ChatBotType> {
  return prisma.chatBot.delete({
    where: { userId, assistantId },
    include: chatBotInclude,
  });
}

export async function createGDriveSourceOptions(
  assistantId: ChatBot["assistantId"],
  gDriveSourceCreate: CreateGDriveSourceOptionsType,
) {
  const data: Prisma.GDriveSourceOptionsCreateInput = Object.assign(
    {
      ChatBot: { connect: { assistantId } },
    },
    gDriveSourceCreate,
  );

  return prisma.gDriveSourceOptions.create({
    data,
  });
}

export async function createWebsiteSourceOptions(
  assistantId: ChatBot["assistantId"],
  websiteSourceCreate: CreateWebsiteSourceOptionsType,
) {
  const data: Prisma.WebsiteSourceOptionsCreateInput = Object.assign(
    {
      ChatBot: { connect: { assistantId } },
    },
    websiteSourceCreate,
  );

  return prisma.websiteSourceOptions.create({
    data,
  });
}

export async function getWebsiteSourceOptions(
  assistantId: WebsiteSourceOptions["assistantId"],
  userId: ChatBot["assistantId"],
) {
  return prisma.websiteSourceOptions.findFirstOrThrow({
    where: {
      assistantId,
      ChatBot: {
        userId,
      },
    },
  });
}
