"use client";
import LoadingSpinner from "@/lib/components/admin/atoms/LoadingSpinner";
import Button from "@/lib/components/admin/molecules/Button";
import { Input, Textarea } from "@/lib/components/admin/molecules/Input";
import InputError from "@/lib/components/admin/molecules/InputError";
import Card from "@/lib/components/admin/organisms/Card";
import ChatBotSources from "@/lib/components/admin/organisms/ChatBotSources";
import { FileSource } from "@/lib/components/admin/organisms/sources/FileSource";
import { ChatBotUI } from "@/lib/components/chatbot-ui/organisms/ChatBotUI";
import CodeView from "@/lib/components/shared/organisms/CodeView";
import { IngestionStatusEnum, UpdateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { FETokenService } from "@/lib/services/frontend-services/token-service";
import { getImportScript } from "@/lib/utils/import-script";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const feChatBotService = FEChatBotService.Instance;
const feTokenService = FETokenService.Instance;
const feRagService = FERAGService.Instance;

const ChatBotEdit: React.FC = () => {
  const params = useParams<{ chatBotId: string }>();
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>();

  const [ingestionStatus, setIngestionStatus] = useState<IngestionStatusEnum>();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<{
    id: string;
    name: string;
    instructions: string;
    initialMessage: string;
    allowedDomains: string;
  }>({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      instructions: "",
      initialMessage: "",
      allowedDomains: "",
    },
  });

  useEffect(() => {
    const getChatBot = async () => {
      const chatbot = await feChatBotService.getChatBot(params.chatBotId);
      setHeaderTitle(chatbot.name);

      setValue("id", chatbot.id);
      setValue("name", chatbot.name);
      setValue("instructions", chatbot.instructions || "");
      setValue("initialMessage", chatbot.initialMessage);
      setValue("allowedDomains", chatbot.allowedDomains?.join(", ") || ""); // Convert array to string
      setIsLoading(false);
      setIngestionStatus(chatbot.ingestionStatus);
    };

    if (params.chatBotId) getChatBot();
  }, [params.chatBotId, setValue]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const status = await feRagService.getIngestionStatus(getValues("id"));
      setIngestionStatus(status);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [ingestionStatus]);

  useEffect(() => {
    const signToken = async () => {
      setToken(
        await feTokenService.signToken(params.chatBotId, [
          window.location.href,
        ]),
      );
    };
    signToken();
  }, [params.chatBotId, token]);

  if (isLoading || !token) return <LoadingSpinner />;

  if (ingestionStatus === "RUNNING") {
    return <LoadingSpinner />;
  }

  const onSubmit = async (data: {
    name: string;
    instructions: string;
    allowedDomains: string;
  }) => {
    const updateChatBot: UpdateChatBotType = {
      name: data.name,
      instructions: data.instructions,
      allowedDomains: data.allowedDomains
        .split(",")
        .map((domain) => domain.trim())
        .filter((domain) => domain.length > 0), // Convert string back to an array and filter empty values
    };

    const updatedChatBot = await feChatBotService.updateChatBot(
      params.chatBotId,
      updateChatBot,
    );
    setHeaderTitle(updatedChatBot.name);
  };

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <Card header={headerTitle}>
        <form
          className="grid grid-cols-1 gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="text"
            label="Titel"
            {...register("name", {
              required: "Titel ist erforderlich",
              minLength: {
                value: 3,
                message: "Mindestens 3 Zeichen erforderlich",
              },
            })}
          />
          <InputError errors={errors} name="name" />

          <Input
            type="text"
            label="Erste Nachrichte"
            {...register("initialMessage", {
              required: "Erste Nachricht ist erforderlich",
              minLength: {
                value: 10,
                message: "Mindestens 10 Zeichen erforderlich",
              },
            })}
          />
          <InputError errors={errors} name="initialMessage" />

          <Input
            type="text"
            label="Erlaubte Domains (durch Komma getrennt)"
            {...register("allowedDomains", {
              validate: (value) => {
                // if (!value.trim()) return "Erlaubte Domains sind erforderlich";
                const domains = value
                  .split(",")
                  .map((domain) => domain.trim())
                  .filter((domain) => domain.length > 0);
                for (const domain of domains) {
                  if (
                    !/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/.test(
                      domain,
                    )
                  ) {
                    return `Ungültige Domain: ${domain}`;
                  }
                }
                return true;
              },
            })}
          />
          <InputError errors={errors} name="allowedDomains" />

          <Textarea
            label="Anweisungen"
            className="h-[10em] resize-none"
            {...register("instructions", {
              required: "Anweisungen sind erforderlich",
              minLength: {
                value: 10,
                message: "Mindestens 10 Zeichen erforderlich",
              },
            })}
          />
          <InputError errors={errors} name="instructions" />

          <Button type="submit" isDisabled={!isValid}>
            Ändern
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="xl:col-span-4 lg:col-span-3">
          <Card header="Chatbot Import">
            <CodeView code={getImportScript(getValues("id"))} />
          </Card>
        </div>

        <div className="xl:col-span-2 lg:col-span-3">
          <Card header="Chatbot Vorschau">
            <ChatBotUI chatBotId={params.chatBotId} token={token} />
          </Card>
        </div>
      </div>

      <FileSource chatBotId={params.chatBotId} />
      <ChatBotSources
        chatBotId={params.chatBotId}
        setIngestionStatus={setIngestionStatus}
        ingestionStatus={ingestionStatus!}
      />
    </div>
  );
};

export default ChatBotEdit;
