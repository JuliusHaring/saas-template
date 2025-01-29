import { User, WebsiteSourceOptions } from "@prisma/client";
import { prisma } from ".";
import { getChatBot } from "./chatbot";

export async function getWebsiteSource(
  userId: User["userId"],
  assistantId: WebsiteSourceOptions["assistantId"],
) {
  await getChatBot(userId, assistantId);

  return prisma.websiteSourceOptions.findFirstOrThrow({
    where: {
      assistantId,
    },
  });
}
