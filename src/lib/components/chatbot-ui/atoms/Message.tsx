import { MessageType } from "@/lib/components/chatbot-ui/types";
import React from "react";

export const Message: React.FC<MessageType> = ({ role, text }) => {
  const isUser = role === "Nutzer";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-lg text-white ${
          isUser
            ? "bg-blue-500 text-right rounded-br-none"
            : "bg-gray-500 text-left rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
};
