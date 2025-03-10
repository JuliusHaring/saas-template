"use client";
import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import { WebsiteSource } from "@/lib/components/admin/organisms/sources/WebsiteSource";
import Divider from "@/lib/components/shared/molecules/Divider";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const feRagService = FERAGService.Instance;

const ChatBotSources: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  const handleIngest = async () => {
    setIsIngesting(true);
    await feRagService.ingestFiles(chatBotId);
    setIsIngesting(false);
  };

  return (
    <Card header={"Daten Quellen"}>
      <Button
        onClick={handleIngest}
        isDisabled={isIngesting}
        className="flex items-center gap-2 w-full"
      >
        <GlobeAltIcon className="h-5 w-5" />
        Crawlen
      </Button>
      <Divider />
      {process.env.NEXT_PUBLIC_SOURCES_WEBSITE?.toLowerCase() === "true" ? (
        <WebsiteSource chatBotId={chatBotId} />
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ChatBotSources;
