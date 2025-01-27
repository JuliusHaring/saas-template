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
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    getChatBots();
  }, []);

  const getSourcesCount = (chatbot: ChatBotType) => {
    let counter = 0;
    if (chatbot.GDriveSourceOptions) counter++;
    if (chatbot.WebsiteSourceOptions) counter++;
    return counter;
  };

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
          header={chatbot.name}
          footer={<Button>Bearbeiten</Button>}
        >
          <p>Dokumente: {chatbot.Documents.length}</p>
          <p>Quellen: {getSourcesCount(chatbot)}</p>
        </Card>
      ))}
    </div>
  );
}
