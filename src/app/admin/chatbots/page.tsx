"use client";
import { Input, Textarea } from "@/lib/components/atoms/Input";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType, CreateChatBotType } from "@/lib/db/chatbot";
import { CreateChatbotBeforeAssistantType } from "@/lib/services/chatbot-service";
import { ChatBot } from "@prisma/client";
import { useState, useEffect } from "react";

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);
  const [formValues, setFormValues] =
    useState<CreateChatbotBeforeAssistantType>({
      name: "",
    });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const chatBotResponse = await fetch("/api/chatbot", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      const newChatbot: ChatBotType = await chatBotResponse.json();

      setChatbots((prevChatbots) => [...prevChatbots, newChatbot]);
      setFormValues({ name: "" });
    } catch (error) {
      console.error("Error creating chatbot:", error);
    }
  };

  return (
    <div>
      <ChatBotCreate
        formValues={formValues}
        setFormValues={setFormValues}
        onSubmit={handleFormSubmit}
      />
      <div className="mt-4"></div>
      <ChatBotGrid chatbots={chatbots} />
    </div>
  );
}

function ChatBotCreate({
  formValues,
  setFormValues,
  onSubmit,
}: {
  formValues: CreateChatbotBeforeAssistantType;
  setFormValues: React.Dispatch<React.SetStateAction<CreateChatBotType>>;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col space-y-4 p-4 bg-gray-200 rounded-lg"
    >
      <Input
        type="text"
        label="Chatbot Name"
        value={formValues.name}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, name: e.target.value }))
        }
        required
      />
      <Textarea
        label="Chatbot Anweisungen"
        value={formValues.instructions || ""}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, instructions: e.target.value }))
        }
      />
      <Button type="submit" variant="primary">
        Hinzufügen
      </Button>
    </form>
  );
}

function ChatBotGrid({ chatbots }: { chatbots: ChatBotType[] }) {
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
      {chatbots
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .map((chatbot) => (
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
