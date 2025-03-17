import { ChatBotService } from "@/lib/services/api-services/chatbot-service";
import { StylesService } from "@/lib/services/api-services/styles-service";
import { signToken } from "@/lib/utils/backend/token";
import { isDevModeEnabled } from "@/lib/utils/dev-mode";

const chatbotService = ChatBotService.Instance;
const styleService = await StylesService.getInstance();

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const chatBotId = url.searchParams.get("chatbotId");

  if (!chatBotId) {
    return new Response("Missing chatbot ID", { status: 400 });
  }

  const style = await styleService.getStyle(chatBotId);

  let allowedDomains =
    await chatbotService.getAllowedDomainsForChatBot(chatBotId);
  allowedDomains = isDevModeEnabled()
    ? [...allowedDomains, "localhost"]
    : allowedDomains;
  if (!allowedDomains) {
    return new Response("Chatbot not found", { status: 404 });
  }

  const token = signToken(chatBotId, allowedDomains);

  const scriptContent = `
    (function() {
      const script = document.currentScript;
      const chatBotId = "${chatBotId}";
      const apiUrl = script.getAttribute("api-url");
      const token = "${token}";
      const parentDomain = window.location.hostname;
      let currentPath = window.location.pathname;

      // Read showOnPages from script attribute and convert it into an array
      const showOnPages = script.getAttribute("show-on-pages")
        ? script.getAttribute("show-on-pages").split(",").map(page => page.trim())
        : [];

      if (!chatBotId || !apiUrl) {
        console.error("Missing required attributes");
        return;
      }

      function injectChatbot() {
        const existingChatbot = document.getElementById("chatbot-iframe");
        if (existingChatbot) {
          existingChatbot.remove();
        }

        // If showOnPages is set and the current page is not in the list, do nothing
        if (showOnPages.length > 0 && !showOnPages.includes(window.location.pathname)) {
          console.log("Chatbot hidden on this page:", window.location.pathname);
          return;
        }

        console.log("Injecting chatbot on page:", window.location.pathname);

        // Create chatbot iframe
        const chatbotContainer = document.createElement("iframe");
        chatbotContainer.id = "chatbot-iframe";
        chatbotContainer.style.position = "fixed";
        chatbotContainer.style.bottom = "${style.offsetYPx}px";
        chatbotContainer.style.right = "${style.offsetXPx}px";
        chatbotContainer.style.width = "50px";
        chatbotContainer.style.height = "50px";
        chatbotContainer.style.border = "none";
        chatbotContainer.style.zIndex = "9999";
        chatbotContainer.style.overflow = "hidden"; // Prevent scrollbars
        chatbotContainer.style.transition = "width 0.3s, height 0.3s";

        chatbotContainer.src = \`\${apiUrl}/chatbot-ui?chatBotId=\${chatBotId}&token=\${token}&parentDomain=\${encodeURIComponent(parentDomain)}\`;
        document.body.appendChild(chatbotContainer);

        // Listen for chatbot resizing messages
        window.addEventListener("message", (event) => {
          console.log("Received message from:", event.origin);
          console.log("Expected API URL:", apiUrl);
          console.log("Received message:", event.data)

          if (event.origin !== apiUrl) return;
          if (event.data.type === "resize") {
            chatbotContainer.style.width = event.data.width;
            chatbotContainer.style.height = event.data.height;
          }
        });
      }

      // Inject chatbot on first load
      injectChatbot();

      // MutationObserver to detect URL changes (for SPAs & Client-Side Routing)
      const observer = new MutationObserver(() => {
        if (window.location.pathname !== currentPath) {
          console.log("Detected page change, updating chatbot visibility");
          currentPath = window.location.pathname;
          injectChatbot();
        }
      });

      // Start observing changes in the document body
      observer.observe(document.body, { childList: true, subtree: true });

    })();
  `;

  return new Response(scriptContent, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}
