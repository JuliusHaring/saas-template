"use client";
import { QuotaUsageType } from "@/lib/services/api-services/quotas-service";
import { ChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { FEQutoaService } from "@/lib/services/frontend-services/quota-service";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { getImportScript } from "@/lib/utils/import-script";
import {
  CodeBracketSquareIcon,
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import QuotasOverview from "@/lib/components/admin/organisms/QuotasOverview";

const feChatBotService = FEChatBotService.Instance;
const feQuotaService = FEQutoaService.Insance;
const feRAGService = FERAGService.Instance;

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>();
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

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

  if (isIngesting) return <LoadingSpinner />;
  if (typeof chatbots === "undefined") return <LoadingSpinner />;

  const handleDelete = async (chatbot: ChatBotType) => {
    try {
      const deletedChatBot = await feChatBotService.deleteChatBot(chatbot.id);

      setChatbots((prevChatbots) =>
        prevChatbots!.filter((c) => c.id !== deletedChatBot.id),
      );
    } catch (error) {
      console.error("Error deleting chatbot:", error);
    }
  };

  return (
    <div>
      <QuotasOverview />
      <Button className="my-2" href="/admin/chatbots/create">
        <PlusIcon className="h-5 w-5 text-white" />
      </Button>
      <ChatBotGrid
        chatbots={chatbots}
        handleDelete={handleDelete}
        setIsIngesting={setIsIngesting}
        setChatbots={setChatbots}
      />
    </div>
  );
}

function ChatBotGrid({
  chatbots,
  handleDelete,
  setIsIngesting,
  setChatbots,
}: {
  chatbots: ChatBotType[];
  handleDelete: (chatbot: ChatBotType) => void;
  setIsIngesting: (isIngesting: boolean) => void;
  setChatbots: (chatbots: ChatBotType[]) => void;
}) {
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsageType>();

  useEffect(() => {
    const getQuotas = async () => {
      const quotas: QuotaUsageType = await feQuotaService.getQuotas();
      setQuotaUsage(quotas);
    };
    getQuotas();
  }, []);

  const getSourcesList = (chatbot: ChatBotType) => {
    const sources = [];
    if (chatbot.GDriveSource) sources.push("GDrive");
    if (chatbot.WebsiteSource)
      sources.push(`Webseite: ${chatbot.WebsiteSource.url}`);
    return sources.length > 0 ? sources.join(", ") : "Keine";
  };

  if (!quotaUsage) return <LoadingSpinner />;

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
                setIsIngesting={setIsIngesting}
                setChatbots={setChatbots}
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
    <div className="flex items-center justify-between">{chatbot.name}</div>
  );
}

function ChatBotCardFooter({
  chatbot,
  handleDelete,
  quotaUsage,
  setIsIngesting,
  setChatbots,
}: {
  chatbot: ChatBotType;
  handleDelete: () => void;
  quotaUsage: QuotaUsageType;
  setIsIngesting: (isIngesting: boolean) => void;
  setChatbots: (chatbots: ChatBotType[]) => void;
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

  const hasSources = () => {
    return !!chatbot.GDriveSource || !!chatbot.WebsiteSource;
  };

  const ingestFiles = async () => {
    setIsIngesting(true);
    await feRAGService.ingestFiles(chatbot.id);
    const chatbots = await feChatBotService.getChatBots();
    setChatbots(chatbots);
    setIsIngesting(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        isDisabled={quotaUsage?.fileCount?.reached || !hasSources()}
        onClick={ingestFiles}
      >
        <ArrowPathIcon className="h-5 w-5 text-white" />
      </Button>

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
