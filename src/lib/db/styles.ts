import { ChatBotIdType, UserIdType, CreateStyleType } from "@/lib/db/types";
import { prisma } from ".";

export const getStyle = async (chatBotId: ChatBotIdType) => {
  return await prisma.style.findFirstOrThrow({
    where: { ChatBot: { is: { id: chatBotId } } },
  });
};

export const createOrUpdateStyle = async (
  userId: UserIdType,
  chatBotId: ChatBotIdType,
  createStyle: CreateStyleType,
) => {
  return await prisma.style.upsert({
    where: { chatBotId, ChatBot: { userId } },
    update: { ...createStyle },
    create: { ...createStyle, ChatBot: { connect: { id: chatBotId, userId } } },
  });
};
