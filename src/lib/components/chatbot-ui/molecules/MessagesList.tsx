import { Message } from "@/lib/components/chatbot-ui/atoms/Message";
import { MessageType } from "@/lib/components/chatbot-ui/types";
import React from "react";

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
}) => (
  <div className="break-words w-full overflow-hidden whitespace-pre-wrap flex-1 overflow-y-auto p-4 space-y-2">
    <Message role="Antwort" html="Wie kann ich behilflich sein?" />
    {messages.map((message, index) => (
      <Message key={index} role={message.role} html={message.html} />
    ))}

    {isTyping && <Message role="Antwort" html="..." />}
  </div>
);
