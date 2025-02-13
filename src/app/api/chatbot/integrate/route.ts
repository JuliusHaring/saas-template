import { ChatBotService } from "@/lib/api-services/chatbot-service";
import { isDevModeEnabled } from "@/lib/utils/dev-mode";
import { sign } from "jsonwebtoken";

const chatbotService = ChatBotService.Instance;

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatbotId");

  if (!chatBotId) {
    return new Response("Missing chatbot ID", { status: 400 });
  }

  let allowedDomains =
    await chatbotService.getAllowedDomainsForChatBot(chatBotId);
  allowedDomains = isDevModeEnabled() ? ["localhost"] : allowedDomains;
  if (!allowedDomains) {
    return new Response("Chatbot not found", { status: 404 });
  }

  // Generate a signed JWT token (expires in 5 minutes)
  const token = sign({ chatBotId, allowedDomains }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
  });

  // Return the script with the signed token
  const scriptContent = `
    (function() {
      const script = document.currentScript;
      const chatBotId = "${chatBotId}";
      const apiUrl = script.getAttribute("api-url");
      const token = "${token}";

      if (!chatBotId || !apiUrl) {
        console.error("Missing required attributes");
        return;
      }

      // Validate domain
      const allowedDomains = ${JSON.stringify(allowedDomains)};
      if (!allowedDomains.some(domain => window.location.hostname.includes(domain))) {
        console.error("Unauthorized domain trying to load chatbot: " + window.location.hostname);
        return;
      }

      // Create chatbot container
      const chatbotContainer = document.createElement("div");
      chatbotContainer.id = "chatbot-container";
      chatbotContainer.style.position = "fixed";
      chatbotContainer.style.bottom = "20px";
      chatbotContainer.style.right = "20px";
      chatbotContainer.style.width = "300px";
      chatbotContainer.style.height = "400px";
      chatbotContainer.style.border = "1px solid #ddd";
      // chatbotContainer.style.borderRadius = "8px";
      chatbotContainer.style.overflow = "hidden";
      chatbotContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      document.body.appendChild(chatbotContainer);

      // Create an iframe for the chatbot
      const iframe = document.createElement("iframe");
      iframe.src = \`\${apiUrl}/chatbot-ui?chatBotId=\${chatBotId}&token=\${token}\`;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      chatbotContainer.appendChild(iframe);
    })();
  `;

  return new Response(scriptContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}
