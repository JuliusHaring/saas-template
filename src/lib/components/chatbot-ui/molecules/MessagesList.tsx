import { Message } from "@/lib/components/chatbot-ui/atoms/Message";
import { MessageRole } from "@/lib/components/chatbot-ui/types";
import React from "react";

interface MessageListProps {
  messages: { role: MessageRole; text: string }[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="break-words break-all w-full overflow-hidden whitespace-pre-wrap flex-1 overflow-y-auto p-4 space-y-2">
    <Message role="Antwort" text="Wie kann ich behilflich sein?" />
    {messages.map((message, index) => (
      <Message key={index} role={message.role} text={message.text} />
    ))}
  </div>
);
