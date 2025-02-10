import { ChatBotType } from "../db/types";
import { baseUrl } from "./base-url";

export function getImportScript(chatbot: ChatBotType) {
  return `
  <script
    src="${baseUrl}/api/chatbot/integrate?chatbotId=${chatbot.id}" 
    api-url="${baseUrl}"
  ></script>`;
}
