"use client";
import { useEffect, useState } from "react";
import { ChatBotUI } from "@/lib/components/chatbot-ui/organisms/ChatBotUI";

const ChatBotUIPage: React.FC = () => {
  const [chatBotId, setChatBotId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [parentDomain, setParentDomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setChatBotId(params.get("chatBotId"));
      setToken(params.get("token"));
      setParentDomain(params.get("parentDomain"));
    }
  }, []);

  if (!chatBotId || !token || !parentDomain) {
    return <></>;
  }

  return (
    <ChatBotUI
      chatBotId={chatBotId}
      token={token}
      parentDomain={parentDomain}
    />
  );
};

export default ChatBotUIPage;
