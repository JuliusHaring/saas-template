import React from "react";
import { Message } from "../atoms/Message";
import { ChatRole } from "../types";

interface MessageListProps {
  messages: { role: ChatRole; text: string }[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {messages.map((message, index) => (
      <Message key={index} role={message.role} text={message.text} />
    ))}
  </div>
);
