"use server";
import { PrismaClient, ChatBot, Prisma, GDriveSource } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateChatBot = Omit<Prisma.ChatBotCreateInput, "userId">;

export type CreateGDriveSource = Omit<
  Prisma.GDriveSourceCreateInput,
  "ChatBot"
>;

export async function getChatBots(userId: ChatBot["userId"]) {
  return prisma.chatBot.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function createChatBot(
  userId: ChatBot["userId"],
  createChatBot: CreateChatBot,
) {
  const data: Prisma.ChatBotCreateInput = Object.assign({}, createChatBot, {
    userId,
  });
  return prisma.chatBot.create({
    data,
  });
}

export async function createGDriveSource(
  chatbotId: ChatBot["id"],
  gDriveSourceCreate: CreateGDriveSource,
) {
  const data: Prisma.GDriveSourceCreateInput = Object.assign(
    {
      ChatBot: { connect: { id: chatbotId } },
    },
    gDriveSourceCreate,
  );

  return prisma.gDriveSource.create({
    data,
  });
}
