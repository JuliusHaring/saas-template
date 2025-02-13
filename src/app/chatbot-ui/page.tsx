"use client";
import { useEffect, useState } from "react";
import { FEStyleService } from "@/lib/frontend-services/style-service";
import { MessageList } from "@/lib/chatbot-ui-components/molecules/MessagesList";
import { ChatInput } from "@/lib/chatbot-ui-components/molecules/ChatInput";
import { MessageType } from "@/lib/chatbot-ui-components/types";

const feStyleService = FEStyleService.Instance;

const ChatbotUI: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatBotId, setChatBotId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("chatBotId");
    const authToken = params.get("token");

    if (id) {
      setChatBotId(id);
      setToken(authToken);

      const storedSessionId = localStorage.getItem(`session_${id}`);
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    } else {
      console.error("Missing chatBotId in the query string");
    }
  }, []);

  useEffect(() => {
    const loadStyles = async () => {
      if (!chatBotId) return;

      try {
        const style = await feStyleService.getStyle(chatBotId);
        const styleTag = document.createElement("style");
        styleTag.innerHTML = style.css;
        document.head.appendChild(styleTag);
      } catch (error) {
        console.error("Failed to load styles:", error);
      }
    };

    loadStyles();
  }, [chatBotId]);

  const sendMessage = async (userMessage: string) => {
    if (!chatBotId || !token) {
      console.error("Missing chatBotId or token.");
      return;
    }

    setMessages((prev) => [...prev, { role: "Nutzer", text: userMessage }]);

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatBotId, userMessage, sessionId, token }),
      });

      if (!response.ok)
        throw new Error("Failed to fetch response from chatbot");

      const { answer, sessionId: newSessionId } = await response.json();

      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem(`session_${chatBotId}`, newSessionId);
      }

      setMessages((prev) => [...prev, { role: "Antwort", text: answer }]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatbotUI;
