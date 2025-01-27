"use client";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType } from "@/lib/db/chatbot";
import { useState, useEffect } from "react";

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);

  useEffect(() => {
    const getChatBots = async () => {
      try {
        const chatbotsResponse = await fetch("/api/chatbot");
        const _chatbots: ChatBotType[] = await chatbotsResponse.json();
        setChatbots(_chatbots);
        console.log(_chatbots);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    getChatBots();
  }, []);

  const responsiveColsClass =
    {
      1: "grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    }[Math.min(3, chatbots.length)] || "grid-cols-1";

  return (
    <div className={`grid ${responsiveColsClass} gap-4`}>
      {chatbots.map((chatbot) => (
        <Card
          key={chatbot.assistantId}
          header={chatbot.assistantId}
          footer={<Button>Bearbeiten</Button>}
        >
          {chatbot.userId}
        </Card>
      ))}
    </div>
  );
}
