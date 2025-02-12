"use client";
import { Input, Textarea } from "@/lib/components/atoms/Input";
import InputError from "@/lib/components/atoms/InputError";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { ChatBotType, UpdateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const feChatBotService = FEChatBotService.Instance;

const ChatBotEdit: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ chatBotId: string }>();
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ChatBotType>({
    defaultValues: {
      name: "",
      instructions: "",
    },
  });

  useEffect(() => {
    const getChatBot = async () => {
      const chatbot = await feChatBotService.getChatBot(params.chatBotId);
      setHeaderTitle(chatbot.name);
      setValue("name", chatbot.name);
      setValue("instructions", chatbot.instructions);
    };
    if (params.chatBotId) getChatBot();
  }, [params.chatBotId, setValue]);

  const onSubmit = async (data: ChatBotType) => {
    const updateChatBot: UpdateChatBotType = {
      name: data.name,
      instructions: data.instructions,
    };
    const updatedChatBot = await feChatBotService.updateChatBot(
      params.chatBotId,
      updateChatBot,
    );
    setHeaderTitle(updatedChatBot.name);
    router.push(`/admin/chatbots`);
  };

  return (
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

        <Textarea
          label="Anweisungen"
          className="h-[10em] resize-none"
          {...register("instructions")}
        />
        <InputError errors={errors} name="instructions" />

        <Button type="submit" isDisabled={!isValid}>
          Ändern
        </Button>
      </form>
    </Card>
  );
};

export default ChatBotEdit;
