"use client";
import { QuotaUsageType } from "@/lib/api-services/quotas-service";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { FEQutoaService } from "@/lib/frontend-services/quota-service";
import { FERAGService } from "@/lib/frontend-services/rag-service";
import { getImportScript } from "@/lib/utils/import-script";
import {
  CodeBracketSquareIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const feChatBotService = FEChatBotService.Instance;
const feQuotaService = FEQutoaService.Insance;
const feRagService = FERAGService.Instance;

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsageType>();

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

    const checkQuota = async () => {
      try {
        const quotaUsage = await feQuotaService.getQuotas();
        setQuotaUsage(quotaUsage);
      } catch (error) {
        console.error("Error fetching quota:", error);
      }
    };

    checkQuota();
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
    <ChatBotGrid
      chatbots={chatbots}
      handleDelete={handleDelete}
      quotaUsage={quotaUsage}
    />
  );
}

function ChatBotGrid({
  chatbots,
  handleDelete,
  quotaUsage,
}: {
  chatbots: ChatBotType[];
  handleDelete: (chatbot: ChatBotType) => void;
  quotaUsage?: QuotaUsageType;
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
                quotaUsage={quotaUsage}
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
  quotaUsage,
}: {
  chatbot: ChatBotType;
  handleDelete: () => void;
  quotaUsage?: QuotaUsageType;
}) {
  const handleIngest = async () => {
    await feRagService.ingestFiles(chatbot.id);
  };

  const hasSources = (): boolean => {
    return (
      [chatbot.GDriveSource, chatbot.WebsiteSource]
        .map((source) => typeof source !== "undefined" && source !== null)
        .indexOf(true) >= 0
    );
  };

  const hasRemainingFiles = (): boolean => {
    return (quotaUsage?.fileCount?.remaining || 0) > 0;
  };

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

      <Button
        onClick={handleIngest}
        isDisabled={!hasRemainingFiles() || !hasSources()}
      >
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
