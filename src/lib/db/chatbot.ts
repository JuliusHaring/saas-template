"use server";
import { ChatBot, Prisma } from "@prisma/client";
import { prisma } from ".";

export type CreateChatBot = Omit<Prisma.ChatBotCreateInput, "userId" | "id">;

export type CreateGDriveSource = Omit<
  Prisma.GDriveSourceCreateInput,
  "ChatBot"
>;

export async function getChatBot(assistantId: ChatBot["assistantId"]) {
  return prisma.chatBot.findFirstOrThrow({
    where: { assistantId },
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

export async function createGDriveSource(
  assistantId: ChatBot["assistantId"],
  gDriveSourceCreate: CreateGDriveSource,
) {
  const data: Prisma.GDriveSourceCreateInput = Object.assign(
    {
      ChatBot: { connect: { assistantId } },
    },
    gDriveSourceCreate,
  );

  return prisma.gDriveSource.create({
    data,
  });
}
