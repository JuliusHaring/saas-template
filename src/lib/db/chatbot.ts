import { prisma } from ".";
import {
  ChatBotIdType,
  chatBotInclude,
  ChatBotType,
  CreateChatBotType,
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

export async function getAllowedDomainsForChatBot(
  chatBotId: ChatBotIdType,
): Promise<string[]> {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { id: chatBotId },
    })
    .then((chatBot) => chatBot.allowedDomains);
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
