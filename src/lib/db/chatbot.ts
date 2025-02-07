import { ChatBot, Prisma, User, WebsiteSourceOptions } from "@prisma/client";
import { prisma } from ".";
import {
  ChatBotIdType,
  chatBotInclude,
  ChatBotType,
  CreateChatBotType,
  CreateGDriveSourceOptionsType,
  CreateWebsiteSourceOptionsType,
  UserIdType,
} from "./types";

export async function getUserIdOfChatbot(chatBotId: ChatBotIdType) {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { id: chatBotId },
    })
    .then((chatbot) => chatbot.userId);
}

export async function getChatBot(userId: UserIdType, chatBotId: ChatBotIdType) {
  return prisma.chatBot.findFirstOrThrow({
    where: { id: chatBotId, userId },
  });
}

export async function getChatBots(userId: UserIdType): Promise<ChatBotType[]> {
  return prisma.chatBot.findMany({
    where: {
      userId: userId,
    },
    include: chatBotInclude,
  });
}

export async function createChatBot(
  userId: UserIdType,
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
  userId: UserIdType,
  chatBotId: ChatBotIdType,
): Promise<ChatBotType> {
  return prisma.chatBot.delete({
    where: { userId, id: chatBotId },
    include: chatBotInclude,
  });
}

export async function createGDriveSourceOptions(
  chatBotId: ChatBotIdType,
  gDriveSourceCreate: CreateGDriveSourceOptionsType,
) {
  const data: Prisma.GDriveSourceOptionsCreateInput = Object.assign(
    {
      ChatBot: { connect: { id: chatBotId } },
    },
    gDriveSourceCreate,
  );

  return prisma.gDriveSourceOptions.create({
    data,
  });
}

export async function createWebsiteSourceOptions(
  chatBotId: ChatBotIdType,
  websiteSourceCreate: CreateWebsiteSourceOptionsType,
) {
  const data: Prisma.WebsiteSourceOptionsCreateInput = Object.assign(
    {
      ChatBot: { connect: { id: chatBotId } },
    },
    websiteSourceCreate,
  );

  return prisma.websiteSourceOptions.create({
    data,
  });
}

export async function getWebsiteSourceOptions(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
) {
  return prisma.websiteSourceOptions.findFirstOrThrow({
    where: {
      chatBotId,
      ChatBot: {
        userId,
      },
    },
  });
}
