import { ChatBotType } from "../db/chatbot";
import { baseUrl } from "./base-url";

export function getImportScript(chatbot: ChatBotType) {
  return `
  <script
    src="${baseUrl}/api/chatbot/integrate" 
    assistant-id="${chatbot.assistantId}" 
    api-url="${baseUrl}"
  ></script>`;
}
