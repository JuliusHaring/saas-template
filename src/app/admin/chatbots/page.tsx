"use client";
import { Input, Textarea } from "@/lib/components/atoms/Input";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType, CreateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { getImportScript } from "@/lib/utils/import-script";
import { getQuotas } from "@/lib/utils/quotas";
import { CodeBracketSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const feChatBotService = FEChatBotService.Instance;

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<ChatBotType[]>([]);
  const [formValues, setFormValues] = useState<CreateChatBotType>({
    name: "",
  });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newChatBot = await feChatBotService.createChatBot(formValues);

      setChatbots((prevChatbots) => [...prevChatbots, newChatBot]);
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
      <ChatBotGrid chatbots={chatbots} handleDelete={handleDelete} />
    </div>
  );
}

function ChatBotCreate({
  formValues,
  setFormValues,
  onSubmit,
}: {
  formValues: CreateChatBotType;
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
            key={chatbot.id}
            header={chatBotCardHeader(chatbot)}
            footer={
              <ChatBotCardFooter
                chatbot={chatbot}
                handleDelete={() => handleDelete(chatbot)} // Pass specific chatbot
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
    <div className="flex items-center justify-between">
      <span className="font-semibold">{chatbot.name}</span>
      <Button onClick={handleCopyToClipboard} className="flex items-center">
        <CodeBracketSquareIcon className="h-5 w-5 text-white" />
      </Button>
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
  const [remainingFiles, setRemainingFiles] = useState<number>(0);
  const [limitFiles, setLimitFiles] = useState<number>(0);

  useEffect(() => {
    const checkQuota = async () => {
      try {
        const res = await getQuotas();
        setRemainingFiles(res.fileCount.remaining);
        setLimitFiles(res.fileCount.limit);
      } catch (error) {
        console.error("Error fetching quota:", error);
      }
    };

    checkQuota();
  }, []);

  const handleIngest = async () => {
    await fetch(`/api/rag/ingest`, {
      method: "POST",
      body: JSON.stringify({ chatBotId: chatbot.id }),
    });
  };

  const hasSources = (): boolean => {
    return (
      [chatbot.GDriveSource, chatbot.WebsiteSource]
        .map((source) => typeof source !== "undefined" && source !== null)
        .indexOf(true) >= 0
    );
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold">{chatbot.name}</span>
      <Button
        onClick={handleIngest}
        isDisabled={remainingFiles <= 0 || !hasSources()}
      >
        Daten importieren ({remainingFiles} / {limitFiles} verbleibend)
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
