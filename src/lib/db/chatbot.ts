import { prisma } from "@/lib/db";
import {
  ChatBotIdType,
  UserIdType,
  chatBotInclude,
  ChatBotType,
  CreateChatBotType,
  UpdateChatBotType,
} from "@/lib/db/types";

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
    include: chatBotInclude,
  });
}

export async function getChatBotName(chatBotId: ChatBotIdType) {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { id: chatBotId },
      include: chatBotInclude,
    })
    .then((cb) => cb.name);
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

export async function updateChatBot(
  userId: UserIdType,
  chatBotId: ChatBotIdType,
  updateChatBot: UpdateChatBotType,
) {
  return prisma.chatBot.update({
    where: { id: chatBotId },
    data: updateChatBot,
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
