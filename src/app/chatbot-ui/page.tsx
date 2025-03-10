"use client";
import { useEffect, useState } from "react";
import { ChatBotUI } from "@/lib/components/chatbot-ui/organisms/ChatBotUI";

const ChatBotUIPage: React.FC = () => {
  const [chatBotId, setChatBotId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setChatBotId(params.get("chatBotId"));
      setToken(params.get("token"));
    }
  }, []);

  if (!chatBotId || !token) {
    return <></>;
  }

  return <ChatBotUI chatBotId={chatBotId} token={token} />;
};

export default ChatBotUIPage;
