import { ChatBotIdType } from "@/lib/db/types";
import { NEXT_PUBLIC_BASE_URL } from "@/lib/utils/environment";

export function getImportScript(chatBotId: ChatBotIdType) {
  return `
  <script
    src="${NEXT_PUBLIC_BASE_URL}/api/chatbot/integrate?chatbotId=${chatBotId}" 
    api-url="${NEXT_PUBLIC_BASE_URL}"
></script>
  `.trim();
}
