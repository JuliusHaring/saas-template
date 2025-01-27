"use client";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType } from "@/lib/db/chatbot";
import { useEffect, useState } from "react";

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

  return (
    <>
      {chatbots.map((chatbot) => (
        <Card
          key={chatbot.assistantId}
          header={chatbot.assistantId}
          footer={<Button>Open</Button>}
        >
          {chatbot.userId}
        </Card>
      ))}
    </>
  );
}
