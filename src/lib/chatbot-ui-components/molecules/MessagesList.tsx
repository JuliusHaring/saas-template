import { Message } from "@/lib/chatbot-ui-components/atoms/Message";
import { MessageRole } from "@/lib/chatbot-ui-components/types";
import React from "react";

interface MessageListProps {
  messages: { role: MessageRole; text: string }[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="break-words break-all w-full overflow-hidden whitespace-pre-wrap flex-1 overflow-y-auto p-4 space-y-2">
    {messages.map((message, index) => (
      <Message key={index} role={message.role} text={message.text} />
    ))}
  </div>
);
