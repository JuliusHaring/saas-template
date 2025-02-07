import { Style, User } from "@prisma/client";
import { prisma } from ".";
import { ChatBotIdType, UserIdType } from "./types";

export const getStyle = async (chatBotId: ChatBotIdType) => {
  return await prisma.style.findUnique({
    where: { chatBotId },
  });
};

export const createOrUpdateStyle = async (
  userId: UserIdType,
  chatBotId: ChatBotIdType,
  css: Style["css"],
) => {
  return await prisma.style.upsert({
    where: { chatBotId, ChatBot: { userId } },
    update: { css },
    create: { chatBotId, css },
  });
};
