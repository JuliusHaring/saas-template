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

const feStyleService = FEStyleService.Instance;
const feChatService = FEChatService.Instance;
const feChatBotService = FEChatBotService.Instance;

interface ChatbotUIProps {
  chatBotId?: string;
  token?: string;
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({
  chatBotId: propChatBotId,
  token: propToken,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatBotId, setChatBotId] = useState<string | null>(
    propChatBotId || null,
  );
  const [chatBotName, setChatBotName] = useState<string>("Chatbot");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(propToken || null);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
    if (!propChatBotId) {
      // Fallback to reading from URL parameters if not provided via props
      const params = new URLSearchParams(window.location.search);
      const id = params.get("chatBotId");
      const authToken = params.get("token");

      if (id) {
        setChatBotId(id);
        setToken(authToken);
      } else {
        console.error("Missing chatBotId in the query string");
      }
    }
  }, [propChatBotId]);

  useEffect(() => {
    if (!chatBotId) return;

    const loadChatBotName = async () => {
      const name = await feChatBotService.getChatBotName(chatBotId);
      setChatBotName(name);
    };
    loadChatBotName();
  }, [chatBotId]);

  useEffect(() => {
    if (!chatBotId) return;

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

    setMessages((prev) => [...prev, { role: "Nutzer", text: userMessage }]);
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

      setMessages((prev) => [...prev, { role: "Antwort", text: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "Antwort",
          text: "Es ist ein Fehler aufgetreten. Versuche es später nochmal!",
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
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={sendMessage} isWaiting={isWaiting} />
        </>
      )}
    </div>
  );
};

export default ChatbotUI;
