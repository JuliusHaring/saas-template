"use client";
import Button from "@/lib/components/admin/molecules/Button";
import { ChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { getImportScript } from "@/lib/utils/import-script";
import { useEffect, useState } from "react";

const feChatBotService = FEChatBotService.Instance;

const Demo: React.FC = () => {
  const [chatBots, setChatBots] = useState<ChatBotType[]>([]);
  const [scriptContent, setScriptContent] = useState<string | null>(null);

  useEffect(() => {
    const getChatBots = async () => {
      const cbs = await feChatBotService.getChatBots();
      setChatBots(cbs);
    };
    getChatBots();
  }, []);

  const handleClick = (chatBot: ChatBotType) => {
    const script = getImportScript(chatBot);

    if (script.includes("<script")) {
      // Extract script content from inside <script> tags
      const extractedScript = script
        .replace(/<\/?script.*?>/g, "") // Remove <script> tags
        .trim();
      setScriptContent(extractedScript);
    } else {
      setScriptContent(script);
    }
  };

  useEffect(() => {
    if (scriptContent) {
      const script = document.createElement("script");
      script.textContent = scriptContent;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [scriptContent]);

  return (
    <div className="m-4 grid-4 gap-2">
      {chatBots.map((cb) => (
        <Button key={cb.id} onClick={() => handleClick(cb)}>
          {cb.name}
        </Button>
      ))}

      {/* No need to use dangerouslySetInnerHTML anymore */}
    </div>
  );
};

export default Demo;
