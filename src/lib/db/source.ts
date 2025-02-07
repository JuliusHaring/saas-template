import { prisma } from ".";
import { getChatBot } from "./chatbot";
import { ChatBotIdType, UserIdType } from "./types";

export async function getWebsiteSource(
  userId: UserIdType,
  chatBotId: ChatBotIdType,
) {
  await getChatBot(userId, chatBotId);

  return prisma.websiteSourceOptions.findFirstOrThrow({
    where: {
      chatBotId,
    },
  });
}
