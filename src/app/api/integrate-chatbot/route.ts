export async function GET(request: Request): Promise<Response> {
  const scriptContent = `
      (function() {
        const script = document.currentScript;
        const assistantId = script.getAttribute("assistant-id");
        const apiUrl = script.getAttribute("api-url");
  
        if (!assistantId || !apiUrl) {
          console.error("Missing required attributes: assistantId or apiUrl");
          return;
        }
  
        // Create a chatbot container
        const chatbotContainer = document.createElement("div");
        chatbotContainer.id = "chatbot-container";
        chatbotContainer.style.position = "fixed";
        chatbotContainer.style.bottom = "20px";
        chatbotContainer.style.right = "20px";
        chatbotContainer.style.width = "300px";
        chatbotContainer.style.height = "400px";
        chatbotContainer.style.border = "1px solid #ddd";
        chatbotContainer.style.borderRadius = "8px";
        chatbotContainer.style.overflow = "hidden";
        chatbotContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        document.body.appendChild(chatbotContainer);
  
        // Create an iframe for the chatbot
        const iframe = document.createElement("iframe");
        iframe.src = \`\${apiUrl}/chatbot-ui?assistantId=\${assistantId}\`;
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
