import { prisma } from "@/lib/db";
import {
  ChatBotIdType,
  ChatBotSourceType,
  CreateGDriveSourceType,
  CreateWebsiteSourceType,
  UserIdType,
  WebsiteSourceType,
} from "@/lib/db/types";
import { BadRequest } from "@/lib/utils/routes/http-errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
  userId: UserIdType,
  chatBotId: ChatBotIdType,
  gDriveSourceCreate: CreateGDriveSourceType,
) {
  const data = Object.assign(
    {
      ChatBot: { connect: { id: chatBotId, userId } },
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
  userId: UserIdType,
  chatBotId: ChatBotIdType,
  websiteSourceCreate: CreateWebsiteSourceType,
) {
  try {
    return await prisma.websiteSource.create({
      data: {
        ChatBot: { connect: { id: chatBotId, userId } },
        ...websiteSourceCreate,
      },
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code === "P2014") {
      throw BadRequest("A WebsiteSource already exists for this ChatBot.");
    }
    throw error;
  }
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

export async function deleteWebsiteSource(
  userId: UserIdType,
  chatBotId: ChatBotIdType,
): Promise<WebsiteSourceType> {
  return prisma.websiteSource.delete({
    where: { chatBotId, ChatBot: { userId } },
  });
}
