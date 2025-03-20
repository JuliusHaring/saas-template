import { PublicChatBotExistsException } from "@/lib/db/chatbot";
import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { PromptService } from "@/lib/services/api-services/prompt-service";
import { NEXT_PUBLIC_BASE_URL } from "@/lib/utils/environment";

const chatbotService = ChatBotService.Instance;
const promptService = PromptService.Instance;

async function main() {
  if (NEXT_PUBLIC_BASE_URL.includes("localhost")) {
    throw Error(`Can not seed from localhost`);
  }
  try {
    await chatbotService.createPublicChatBot({
      id: "efe5f5bb-df4b-49b8-916c-e3072be52583",
      name: "KnexAI Bot",
      initialMessage: "Wie kann ich helfen?",
      instructions: promptService.generatePublicChatBotPrompt(),
      allowedDomains: [NEXT_PUBLIC_BASE_URL],
      Style: { create: { offsetYPx: 70 } },
    });
  } catch (e) {
    if (e instanceof PublicChatBotExistsException) {
      console.warn(`Did not execute seed, public ChatBot already exists`);
    } else {
      throw e;
    }
  }
}
main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
