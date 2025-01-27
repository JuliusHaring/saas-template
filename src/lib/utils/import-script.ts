import { ChatBotType } from "../db/chatbot";

export function getImportScript(chatbot: ChatBotType) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `
  <script
    src="${baseUrl}/api/chatbot/integrate" 
    assistant-id="${chatbot.assistantId}" 
    api-url="${baseUrl}"
  ></script>`;
}
