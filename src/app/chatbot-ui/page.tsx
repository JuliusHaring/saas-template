"use client";
import { useEffect, useRef, useState } from "react";
import { FEStyleService } from "@/lib/frontend-services/style-service";
import { MessageList } from "@/lib/chatbot-ui-components/molecules/MessagesList";
import { ChatInput } from "@/lib/chatbot-ui-components/molecules/ChatInput";
import { MessageType } from "@/lib/chatbot-ui-components/types";
import { FEChatService } from "@/lib/frontend-services/chat-service";

const feStyleService = FEStyleService.Instance;
const feChatService = FEChatService.Instance;

const ChatbotUI: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatBotId, setChatBotId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false); // Prevent multiple sends
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

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
    if (!chatBotId || !token || isWaiting) return; // Block sending while waiting

    setMessages((prev) => [...prev, { role: "Nutzer", text: userMessage }]);
    setIsWaiting(true);

    try {
      const { answer, sessionId: newSessionId } =
        await feChatService.sendMessage({
          chatBotId,
          userMessage,
          sessionId,
          token,
        });

      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        localStorage.setItem(`session_${chatBotId}`, newSessionId);
      }

      setMessages((prev) => [...prev, { role: "Antwort", text: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "Antwort",
          text: "Es ist ein Fehler aufgetreten. Versuche es bitte später nochmal!",
        },
      ]);
      console.error("Error communicating with chatbot:", error);
    } finally {
      setIsWaiting(false);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    if (!isUserScrolling) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Detect user scrolling manually
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 10); // Detects if user is near the bottom
  };

  return (
    <div className="fixed bottom-5 right-5 w-[300px] h-[400px] border border-gray-300 shadow-lg bg-white flex flex-col">
      {/* Scrollable messages area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2"
      >
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input - stays at the bottom */}
      <ChatInput onSend={sendMessage} isWaiting={isWaiting} />
    </div>
  );
};

export default ChatbotUI;
