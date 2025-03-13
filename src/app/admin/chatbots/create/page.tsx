"use client";
import Button from "@/lib/components/admin/molecules/Button";
import { Input, Textarea } from "@/lib/components/admin/molecules/Input";
import InputError from "@/lib/components/admin/molecules/InputError";
import Card from "@/lib/components/admin/organisms/Card";
import { CreateChatBotType } from "@/lib/db/types";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { urlPattern } from "@/lib/utils/patterns";
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
    initialMessage: string;
    allowedDomains: string; // Handle it as a comma-separated string in the form
  }>({
    mode: "onChange",
    defaultValues: {
      name: "",
      instructions: "",
      initialMessage: "",
      allowedDomains: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    instructions: string;
    initialMessage: string;
    allowedDomains: string;
  }) => {
    const newChatBot: CreateChatBotType = {
      name: data.name,
      instructions: data.instructions,
      initialMessage: data.initialMessage,
      allowedDomains: data.allowedDomains
        .split(",")
        .map((domain) => domain.trim())
        .filter((domain) => domain.length > 0), // Convert string back to an array and filter empty values
    };

    await feChatBotService.createChatBot(newChatBot);
    router.push(`/admin/chatbots`);
  };

  return (
    <Card header={"Neuen Chatbot erstellen"}>
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
              if (!value.trim()) return "Erlaubte Domains sind erforderlich";
              const domains = value.split(",").map((domain) => domain.trim());
              for (const domain of domains) {
                if (urlPattern.test(domain)) {
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
