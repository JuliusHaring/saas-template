"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { MessageList } from "@/lib/components/chatbot-ui/molecules/MessagesList";
import { ChatInput } from "@/lib/components/chatbot-ui/molecules/ChatInput";
import { MessageType } from "@/lib/components/chatbot-ui/types";
import Headline from "@/lib/components/shared/molecules/Headline";
import { ChatBotIdType, ChatBotPublicType } from "@/lib/db/types";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import { FEChatService } from "@/lib/services/frontend-services/chat-service";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { FEStyleService } from "@/lib/services/frontend-services/style-service";

const feStyleService = FEStyleService.Instance;
const feChatService = FEChatService.Instance;
const feChatBotService = FEChatBotService.Instance;

interface ChatBotUIProps {
  chatBotId: ChatBotIdType;
  token: string;
  parentDomain: string;
  isExternal?: boolean;
}

export const ChatBotUI: React.FC<ChatBotUIProps> = ({
  chatBotId,
  token,
  parentDomain,
  isExternal = true,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatBotPublic, setChatBotPublic] = useState<ChatBotPublicType>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(isExternal);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const updateSize = () => {
    const chatbotDiv = document.getElementById("chatbot-root");
    if (!chatbotDiv) return;

    setIsMinimized((prev) => !prev);

    if (isExternal) {
      const newWidth = isMinimized ? "350px" : "50px";
      const newHeight = isMinimized ? "500px" : "50px";

      chatbotDiv.style.width = newWidth;
      chatbotDiv.style.height = newHeight;

      window.parent.postMessage(
        { type: "resize", width: newWidth, height: newHeight },
        "*",
      );
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
  }, [messages, isUserScrolling]);

  // Detect user scrolling manually
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsUserScrolling(scrollTop + clientHeight < scrollHeight - 10); // Detects if user is near the bottom
  };

  useEffect(() => {
    const loadChatBotName = async () => {
      const cbPublic = await feChatBotService.getChatBotPublic(chatBotId);
      setChatBotPublic(cbPublic);
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
          parentDomain,
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

  if (!chatBotPublic) {
    if (!isExternal) return <LoadingSpinner />;
    return <></>;
  }

  return (
    <div
      className={`z-999 flex flex-col bg-white transition-all duration-300 border border-gray-300 ${!isExternal && `${isMinimized ? "h-[50px]" : "h-[500px]"}`}`}
      id="chatbot-root"
    >
      <div
        className={`bg-blue-500 p-3 flex items-center text-white cursor-pointer ${isMinimized ? "justify-center h-full" : "justify-between"}`}
        onClick={() => {
          updateSize();
        }}
      >
        {isMinimized ? (
          <ArrowUpIcon className="h-5 w-5 text-white" />
        ) : (
          <>
            <Headline level={3}>{chatBotPublic.name}</Headline>
            <ArrowDownIcon className="h-5 w-5 text-white" />
          </>
        )}
      </div>

      {!isMinimized && (
        <>
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2"
            onScroll={handleScroll}
          >
            <MessageList
              messages={messages}
              isTyping={isWaiting}
              initialMessage={chatBotPublic.initialMessage}
            />
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSend={sendMessage} isWaiting={isWaiting} />
        </>
      )}
    </div>
  );
};
