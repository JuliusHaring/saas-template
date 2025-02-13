import { ChatBotType } from "@/lib/db/types";
import { baseUrl } from "@/lib/utils/base-url";

export function getImportScript(chatbot: ChatBotType) {
  return `
  <script
    src="${baseUrl}/api/chatbot/integrate?chatbotId=${chatbot.id}" 
    api-url="${baseUrl}"
></script>
  `.trim();
}
