"use server";
import { ChatBot, Prisma, WebsiteSourceOptions } from "@prisma/client";
import { prisma } from ".";

export type CreateChatBot = Omit<Prisma.ChatBotCreateInput, "userId" | "id">;

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

export async function getChatBots(userId: ChatBot["userId"]) {
  return prisma.chatBot.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function createChatBot(
  userId: ChatBot["userId"],
  assistantId: ChatBot["assistantId"],
) {
  return prisma.chatBot.create({
    data: {
      assistantId,
      userId,
    },
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
