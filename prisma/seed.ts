import { PublicChatBotExistsException } from "@/lib/db/chatbot";
import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { PromptService } from "@/lib/services/api-services/prompt-service";
import { baseUrl } from "@/lib/utils/base-url";

const chatbotService = ChatBotService.Instance;
const promptService = PromptService.Instance;

async function main() {
  if (baseUrl.includes("localhost")) {
    throw Error(`Can not seed from localhost`);
  }
  try {
    await chatbotService.createChatBot({
      id: "efe5f5bb-df4b-49b8-916c-e3072be52583",
      name: "KnexAI Bot",
      initialMessage: "Wie kann ich helfen?",
      instructions: promptService.generatePublicChatBotPrompt(),
      allowedDomains: [baseUrl],
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
