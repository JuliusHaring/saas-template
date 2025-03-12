import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { signToken } from "@/lib/utils/backend/token";
import { isDevModeEnabled } from "@/lib/utils/dev-mode";

const chatbotService = ChatBotService.Instance;

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatbotId");

  if (!chatBotId) {
    return new Response("Missing chatbot ID", { status: 400 });
  }

  let allowedDomains =
    await chatbotService.getAllowedDomainsForChatBot(chatBotId);
  allowedDomains = isDevModeEnabled()
    ? [...allowedDomains, "localhost"]
    : allowedDomains;
  if (!allowedDomains) {
    return new Response("Chatbot not found", { status: 404 });
  }

  // Generate a signed JWT token (expires in 5 minutes)
  const token = signToken(chatBotId, allowedDomains);

  // Return the script with the signed token
  const scriptContent = `
    (function() {
      const script = document.currentScript;
      const chatBotId = "${chatBotId}";
      const apiUrl = script.getAttribute("api-url");
      const token = "${token}";
      const parentDomain = window.location.hostname;

      if (!chatBotId || !apiUrl) {
        console.error("Missing required attributes");
        return;
      }

      // Create chatbot container
      const chatbotContainer = document.createElement("iframe");
      chatbotContainer.style.top = 0;
      chatbotContainer.style.bottom = 0;
      chatbotContainer.style.right = 0;
      chatbotContainer.style.left = 0;
      chatbotContainer.style.width = "100%";
      chatbotContainer.style.height = "100%";
      chatbotContainer.style.overflow = "auto";
      chatbotContainer.style.position = "fixed";
      chatbotContainer.src = \`\${apiUrl}/chatbot-ui?chatBotId=\${chatBotId}&token=\${token}&parentDomain=\${encodeURIComponent(parentDomain)}\`;
      document.body.appendChild(chatbotContainer);
    })();
`;

  return new Response(scriptContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}
