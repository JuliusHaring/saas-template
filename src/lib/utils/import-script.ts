import { ChatBotIdType } from "@/lib/db/types";
import { baseUrl } from "@/lib/utils/base-url";

export function getImportScript(chatBotId: ChatBotIdType) {
  return `
  <script
    src="${baseUrl}/api/chatbot/integrate?chatbotId=${chatBotId}" 
    api-url="${baseUrl}"
></script>
  `.trim();
}
