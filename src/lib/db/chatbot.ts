import { prisma } from "@/lib/db";
import {
  ChatBotIdType,
  UserIdType,
  chatBotInclude,
  ChatBotType,
  CreateChatBotType,
  UpdateChatBotType,
  IngestionStatusEnum,
  ChatBotPublicType,
} from "@/lib/db/types";
import { Prisma } from "@prisma/client";

export class PublicChatBotExistsException extends Error {}

export async function getUserIdOfChatbot(chatBotId: ChatBotIdType) {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { id: chatBotId },
    })
    .then((chatbot) => chatbot.userId);
}

export async function getChatBot(
  chatBotId: ChatBotIdType,
  userId?: UserIdType,
) {
  const findChatbot: Prisma.ChatBotFindFirstOrThrowArgs["where"] = {
    id: chatBotId,
  };
  if (typeof userId !== "undefined") {
    findChatbot.userId = userId;
  }
  return prisma.chatBot.findFirstOrThrow({
    where: findChatbot,
    include: chatBotInclude,
  });
}

export async function getChatBotPublic(
  chatBotId: ChatBotIdType,
): Promise<ChatBotPublicType> {
  return prisma.chatBot
    .findFirstOrThrow({
      where: { id: chatBotId },
      include: chatBotInclude,
    })
    .then((cb) => ({
      name: cb.name,
      initialMessage: cb.initialMessage,
    }));
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
  createChatBot: CreateChatBotType,
  userId?: UserIdType,
): Promise<ChatBotType> {
  if (typeof userId === "undefined") {
    const count = await prisma.chatBot.count({ where: { userId } });
    if (count > 0) {
      throw new PublicChatBotExistsException();
    }
  }

  return prisma.chatBot.create({
    data: {
      userId,
      ...createChatBot,
      Style: {
        create: {},
      },
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
    where: { id: chatBotId, userId },
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

export async function setIngestionStatus(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
  ingestionStatus: IngestionStatusEnum,
) {
  return prisma.chatBot.update({
    where: { id: chatBotId, userId },
    data: { ingestionStatus },
  });
}

export async function getIngestionStatus(
  chatBotId: ChatBotIdType,
  userId: UserIdType,
): Promise<IngestionStatusEnum> {
  return prisma.chatBot
    .findFirstOrThrow({ where: { id: chatBotId, userId } })
    .then((cb) => cb.ingestionStatus);
}
