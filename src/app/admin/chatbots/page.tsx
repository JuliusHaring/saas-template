"use client";
import { ChatBotType } from "@/lib/db/chatbot";
import { ChatBot } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);

  useEffect(() => {
    const getChatBots = async () => {
      try {
        const chatbotsResponse = await fetch("/api/chatbot");
        const _chatbots: ChatBotType[] = await chatbotsResponse.json();
        setChatbots(_chatbots);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    getChatBots();
  }, []);

  return (
    <>
      {chatbots.map((chatbot) => (
        <div key={chatbot.assistantId}>
          {chatbot.assistantId} | {chatbot.userId}
        </div>
      ))}
    </>
  );
}
