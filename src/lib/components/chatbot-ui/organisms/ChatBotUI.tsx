"use client";
import { useEffect, useRef, useState } from "react";
import { FEStyleService } from "@/lib/services/frontend-services/style-service";
import { FEChatService } from "@/lib/services/frontend-services/chat-service";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { MessageList } from "@/lib/components/chatbot-ui/molecules/MessagesList";
import { ChatInput } from "@/lib/components/chatbot-ui/molecules/ChatInput";
import { MessageType } from "@/lib/components/chatbot-ui/types";
import Headline from "@/lib/components/shared/molecules/Headline";
import { ChatBotIdType } from "@/lib/db/types";

const feStyleService = FEStyleService.Instance;
const feChatService = FEChatService.Instance;
const feChatBotService = FEChatBotService.Instance;

interface ChatBotUIProps {
  chatBotId: ChatBotIdType;
  token: string;
}

export const ChatBotUI: React.FC<ChatBotUIProps> = ({ chatBotId, token }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatBotName, setChatBotName] = useState<string>("Chatbot");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Auto-scroll logic
  useEffect(() => {
    if (!isUserScrolling) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isUserScrolling]);

  // Detect user scrolling manually
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 10); // Detects if user is near the bottom
  };

  useEffect(() => {
    const loadChatBotName = async () => {
      const name = await feChatBotService.getChatBotName(chatBotId);
      setChatBotName(name);
    };
    loadChatBotName();
  }, [chatBotId]);

  useEffect(() => {
    const loadStyles = async () => {
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
    if (!chatBotId || !token || isWaiting) return;

    setMessages((prev) => [...prev, { role: "Nutzer", html: userMessage }]);
    setIsWaiting(true);

    try {
      const { response, sessionId: newSessionId } =
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

      setMessages((prev) => [...prev, { role: "Antwort", html: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "Antwort",
          html: "Es ist ein Fehler aufgetreten. Versuche es später nochmal!",
        },
      ]);
      console.error("Error communicating with chatbot:", error);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div
      className={`border border-gray-300 shadow-lg bg-white flex flex-col ${!isMinimized ? "h-150" : ""}`}
      onScroll={handleScroll}
    >
      <div
        className="flex items-center justify-between bg-blue-500 text-white p-3 cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <Headline level={3}>{chatBotName}</Headline>
        {isMinimized ? (
          <ArrowUpIcon className="h-5 w-5 text-white" />
        ) : (
          <ArrowDownIcon className="h-5 w-5 text-white" />
        )}
      </div>

      {!isMinimized && (
        <>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-2">
            <MessageList messages={messages} isTyping={isWaiting} />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={sendMessage} isWaiting={isWaiting} />
        </>
      )}
    </div>
  );
};
