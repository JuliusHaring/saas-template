import { Style, User } from "@prisma/client";
import { prisma } from ".";

export const getStyle = async (assistantId: Style["assistantId"]) => {
  return await prisma.style.findUnique({
    where: { assistantId },
  });
};

export const createOrUpdateStyle = async (
  userId: User["userId"],
  assistantId: Style["assistantId"],
  css: Style["css"],
) => {
  return await prisma.style.upsert({
    where: { assistantId, ChatBot: { userId } },
    update: { css },
    create: { assistantId, css },
  });
};
