"use client";
import { Input, Textarea } from "@/lib/components/atoms/Input";
import InputError from "@/lib/components/atoms/InputError";
import Button from "@/lib/components/molecules/button";
import Card from "@/lib/components/organisms/Card";
import { CreateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/frontend-services/chatbot-service";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const feChatBotService = FEChatBotService.Instance;

const ChatBotCreate: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{
    name: string;
    instructions: string;
    allowedDomains: string; // Handle it as a comma-separated string in the form
  }>({
    mode: "onChange",
    defaultValues: {
      name: "",
      instructions: "",
      allowedDomains: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    instructions: string;
    allowedDomains: string;
  }) => {
    const newChatBot: CreateChatBotType = {
      name: data.name,
      instructions: data.instructions,
      allowedDomains: data.allowedDomains
        .split(",")
        .map((domain) => domain.trim())
        .filter((domain) => domain.length > 0), // Convert string back to an array and filter empty values
    };

    await feChatBotService.createChatBot(newChatBot);
    router.push(`/admin/chatbots`);
  };

  return (
    <Card header={<h1 className="font-semibold">Neuen Chatbot erstellen</h1>}>
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
          Erstellen
        </Button>
      </form>
    </Card>
  );
};

export default ChatBotCreate;
