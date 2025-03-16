import { MessageType } from "@/lib/components/chatbot-ui/types";
import { StyleType } from "@/lib/db/types";
import React from "react";

export const Message: React.FC<MessageType & { style: StyleType }> = ({
  role,
  html,
  style,
}) => {
  const isUser = role === "Nutzer";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-lg ${style.classText} ${
          isUser
            ? `${style.classBgUser} text-right rounded-br-none`
            : `${style.classBgBot} text-left rounded-bl-none`
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
};
