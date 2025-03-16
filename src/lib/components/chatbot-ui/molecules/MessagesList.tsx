import { Message } from "@/lib/components/chatbot-ui/atoms/Message";
import { MessageType } from "@/lib/components/chatbot-ui/types";
import { StyleType } from "@/lib/db/types";
import { baseUrl } from "@/lib/utils/base-url";
import React from "react";

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  initialMessage: string;
  style: StyleType;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  initialMessage,
  style,
}) => (
  <div className="break-words w-full overflow-hidden whitespace-pre-wrap flex-1 overflow-y-auto pb-4 px-2 space-y-2">
    <p className="text-gray-400 text-sm mt-1 text-center">
      ChatBot erstellt mit{" "}
      <a
        href={baseUrl}
        target="_top"
        className="font-extrabold text-large hover:text-blue-600"
      >
        KnexAI
      </a>
    </p>

    <Message role="Antwort" html={initialMessage} style={style} />
    {messages.map((message, index) => (
      <Message
        key={index}
        role={message.role}
        html={message.html}
        style={style}
      />
    ))}

    {isTyping && <Message role="Antwort" html="..." style={style} />}
  </div>
);
