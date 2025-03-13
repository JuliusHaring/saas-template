import { Message } from "@/lib/components/chatbot-ui/atoms/Message";
import { MessageType } from "@/lib/components/chatbot-ui/types";
import React from "react";

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  initialMessage: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  initialMessage,
}) => (
  <div className="break-words w-full overflow-hidden whitespace-pre-wrap flex-1 overflow-y-auto pb-4 px-2 space-y-2">
    <p className="text-gray-400 text-sm mt-1 text-center">
      ChatBot erstellt mit{" "}
      <a href={process.env.NEXT_PUBLIC_BASE_URL} target="_top">
        KnexAI
      </a>
    </p>

    <Message role="Antwort" html={initialMessage} />
    {messages.map((message, index) => (
      <Message key={index} role={message.role} html={message.html} />
    ))}

    {isTyping && <Message role="Antwort" html="..." />}
  </div>
);
