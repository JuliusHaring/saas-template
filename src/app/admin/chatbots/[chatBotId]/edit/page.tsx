"use client";
import { Input, Textarea } from "@/lib/components/molecules/Input";
import InputError from "@/lib/components/molecules/InputError";
import LoadingSpinner from "@/lib/components/atoms/LoadingSpinner";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import ChatBotSources from "@/lib/components/organisms/ChatBotSources";
import { UpdateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const feChatBotService = FEChatBotService.Instance;

const ChatBotEdit: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ chatBotId: string }>();
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    allowedDomains: string; // Handle it as a comma-separated string in the form
  }>({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      instructions: "",
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
      setValue("allowedDomains", chatbot.allowedDomains?.join(", ") || ""); // Convert array to string
      setIsLoading(false);
    };

    if (params.chatBotId) getChatBot();
  }, [params.chatBotId, setValue]);

  if (isLoading) return <LoadingSpinner />;

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
    router.push(`/admin/chatbots`);
  };

  return (
    <div className="grid grid-cols-1 gap-y-4">
      <Card header={<h1 className="font-semibold">{headerTitle}</h1>}>
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
            label="Erlaubte Domains (durch Komma getrennt)"
            {...register("allowedDomains", {
              validate: (value) => {
                if (!value.trim()) return "Erlaubte Domains sind erforderlich";
                const domains = value.split(",").map((domain) => domain.trim());
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
      <ChatBotSources chatBotId={getValues("id")} />
    </div>
  );
};

export default ChatBotEdit;
