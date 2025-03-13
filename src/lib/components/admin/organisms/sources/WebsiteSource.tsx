import Button from "@/lib/components/admin/molecules/Button";
import { Input } from "@/lib/components/admin/molecules/Input";
import InputError from "@/lib/components/admin/molecules/InputError";
import { FEChatBotService } from "@/lib/services/frontend-services/chatbot-service";
import { urlPattern } from "@/lib/utils/patterns";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const feChatBotService = FEChatBotService.Instance;

export const WebsiteSource: React.FC<{ chatBotId: string }> = ({
  chatBotId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<{ url?: string; url_exceptions?: string }>({
    mode: "onChange",
    defaultValues: {
      url: "",
      url_exceptions: "",
    },
  });
  const [hasWebsiteSource, setHasWebsiteSource] = useState<boolean>(false);

  useEffect(() => {
    const fetchWebsites = async () => {
      const chatbot = await feChatBotService.getChatBot(chatBotId);

      setValue("url", chatbot.WebsiteSource?.url);
      setValue(
        "url_exceptions",
        chatbot.WebsiteSource?.url_exceptions.join(", "),
      );

      setHasWebsiteSource(
        chatbot.WebsiteSource !== null &&
          typeof chatbot.WebsiteSource !== "undefined",
      );
    };
    fetchWebsites();
  }, [chatBotId, setValue]);

  const onSubmit = async (data: { url?: string; url_exceptions?: string }) => {
    if (!data.url) return;

    const newWebsite = {
      url: data.url.trim(),
      url_exceptions: ((data.url_exceptions || "") as string)
        .split(",")
        .map((exception) => exception.trim())
        .filter((exception) => exception.length > 0),
    };

    const updatedChatBot = await feChatBotService.updateChatBot(chatBotId, {
      WebsiteSource: {
        upsert: {
          update: newWebsite,
          create: {
            url: newWebsite.url,
            url_exceptions: newWebsite.url_exceptions,
          },
        },
      },
    });

    setValue("url", updatedChatBot.WebsiteSource?.url);
    setValue(
      "url_exceptions",
      updatedChatBot.WebsiteSource?.url_exceptions.join(", "),
    );
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    await feChatBotService.deleteWebsiteSource(chatBotId);
    setValue("url", undefined);
    setValue("url_exceptions", undefined);
    setHasWebsiteSource(false);
  };

  return (
    <form
      className="grid grid-cols-1 gap-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        type="text"
        label="Website-URL"
        {...register("url", {
          required: "Eine URL ist erforderlich",
          pattern: {
            value: urlPattern,
            message: `Ungültige Domain: ${getValues("url")}`,
          },
        })}
      />
      <InputError errors={errors} name="url" />

      <Input
        type="text"
        label="Ausgenommene URLs (RegExp, durch Komma getrennt)"
        {...register("url_exceptions")}
      />
      <InputError errors={errors} name="url_exceptions" />

      <div className="grid grid-cols-2 gap-x-2">
        <Button type="submit" isDisabled={!isValid}>
          Ändern
        </Button>

        <Button
          variant="danger"
          isDisabled={!hasWebsiteSource}
          onClick={(event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleDelete(event!)
          }
        >
          Löschen
        </Button>
      </div>
    </form>
  );
};
