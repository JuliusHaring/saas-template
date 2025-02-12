"use client";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import QuotasOverview from "@/lib/components/organisms/QuotasOverview";
import { ChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { getImportScript } from "@/lib/utils/import-script";
import {
  CodeBracketSquareIcon,
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const feChatBotService = FEChatBotService.Instance;

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);

  useEffect(() => {
    const getChatBots = async () => {
      try {
        const chatBots = await feChatBotService.getChatBots();
        setChatbots(chatBots);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      }
    };

    getChatBots();
  }, []);

  const handleDelete = async (chatbot: ChatBotType) => {
    try {
      const deletedChatBot = await feChatBotService.deleteChatBot(chatbot.id);

      setChatbots((prevChatbots) =>
        prevChatbots.filter((c) => c.id !== deletedChatBot.id),
      );
    } catch (error) {
      console.error("Error deleting chatbot:", error);
    }
  };

  return (
    <div>
      <QuotasOverview />
      <Button className="my-2">
        <PlusIcon className="h-5 w-5 text-white" />
      </Button>
      <ChatBotGrid chatbots={chatbots} handleDelete={handleDelete} />
    </div>
  );
}

function ChatBotGrid({
  chatbots,
  handleDelete,
}: {
  chatbots: ChatBotType[];
  handleDelete: (chatbot: ChatBotType) => void;
}) {
  const getSourcesList = (chatbot: ChatBotType) => {
    const sources = [];
    if (chatbot.GDriveSource) sources.push("GDrive");
    if (chatbot.WebsiteSource)
      sources.push(`Webseite: ${chatbot.WebsiteSource.url}`);
    return sources.length > 0 ? sources.join(", ") : "Keine";
  };

  return (
    <div className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3n gap-4`}>
      {chatbots
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .map((chatbot) => (
          <Card
            key={chatbot.id}
            header={chatBotCardHeader(chatbot)}
            footer={
              <ChatBotCardFooter
                chatbot={chatbot}
                handleDelete={() => handleDelete(chatbot)}
              />
            }
          >
            <p>Dokumente: {chatbot.Documents.length}</p>
            <p>Quellen: {getSourcesList(chatbot)}</p>
          </Card>
        ))}
    </div>
  );
}

function chatBotCardHeader(chatbot: ChatBotType) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold">{chatbot.name}</span>
    </div>
  );
}

function ChatBotCardFooter({
  chatbot,
  handleDelete,
}: {
  chatbot: ChatBotType;
  handleDelete: () => void;
}) {
  const handleCopyToClipboard = () => {
    const script = getImportScript(chatbot);
    navigator.clipboard.writeText(script).then(
      () => {
        alert("Script copied to clipboard!");
      },
      (error) => {
        console.error("Failed to copy script:", error);
      },
    );
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={handleCopyToClipboard} className="flex items-center">
        <CodeBracketSquareIcon className="h-5 w-5 text-white" />
      </Button>

      <Button href={`/admin/chatbots/${chatbot.id}/edit`}>
        <PencilSquareIcon className="h-5 w-5 text-white" />
      </Button>
      <Button
        variant="danger"
        onClick={handleDelete}
        className="flex items-center"
      >
        <TrashIcon className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
