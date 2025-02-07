import { prisma } from ".";
import { getChatBot } from "./chatbot";
import {
  ChatBotIdType,
  ChatBotSourceType,
  CreateGDriveSourceType,
  CreateWebsiteSourceType,
  UserIdType,
} from "./types";

export async function getSources(
  userId: UserIdType,
): Promise<ChatBotSourceType[]> {
  const sourcesFilter = { where: { ChatBot: { userId } } };
  const websiteSources: ChatBotSourceType[] =
    await prisma.websiteSource.findMany(sourcesFilter);
  const gDriveSources: ChatBotSourceType[] =
    await prisma.gDriveSource.findMany(sourcesFilter);

  return [...websiteSources, ...gDriveSources];
}

export async function createGDriveSource(
  chatBotId: ChatBotIdType,
  gDriveSourceCreate: CreateGDriveSourceType,
) {
  const data = Object.assign(
    {
      ChatBot: { connect: { id: chatBotId } },
    },
    gDriveSourceCreate,
  );

  return prisma.gDriveSource.create({
    data,
  });
}

export async function getGDriveSource(
  userId: UserIdType,
  chatBotId: ChatBotIdType,
) {
  return prisma.gDriveSource.findFirstOrThrow({
    where: {
      chatBotId,
      ChatBot: {
        userId,
      },
    },
  });
}

export async function createWebsiteSource(
  chatBotId: ChatBotIdType,
  websiteSourceCreate: CreateWebsiteSourceType,
) {
  const data = Object.assign(
    {
      ChatBot: { connect: { id: chatBotId } },
    },
    websiteSourceCreate,
  );

  return prisma.websiteSource.create({
    data,
  });
}

export async function getWebsiteSource(
  userId: UserIdType,
  chatBotId: ChatBotIdType,
) {
  return prisma.websiteSource.findFirstOrThrow({
    where: {
      chatBotId,
      ChatBot: {
        userId,
      },
    },
  });
}
