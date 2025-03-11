"use client";
import Banner from "@/lib/components/admin/molecules/Banner";
import Button from "@/lib/components/admin/molecules/Button";
import Card from "@/lib/components/admin/organisms/Card";
import { WebsiteSource } from "@/lib/components/admin/organisms/sources/WebsiteSource";
import Divider from "@/lib/components/shared/molecules/Divider";
import { IngestionStatusEnum } from "@/lib/db/types";
import { FERAGService } from "@/lib/services/frontend-services/rag-service";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const feRagService = FERAGService.Instance;

const ChatBotSources: React.FC<{
  chatBotId: string;
  setIngestionStatus: (v: IngestionStatusEnum) => void;
  ingestionStatus: IngestionStatusEnum;
}> = ({ chatBotId, setIngestionStatus, ingestionStatus }) => {
  const handleIngest = async () => {
    setIngestionStatus("RUNNING");
    feRagService.ingestFiles(chatBotId);
  };

  function getIngestionErrorBanner() {
    const className = "mb-4";
    switch (ingestionStatus) {
      case "ABORTED":
        return (
          <Banner className={className} variant="danger">
            Ein Fehler ist aufgetreten, bitte versuchen Sie es später erneut.
          </Banner>
        );
      case "LIMITED":
        return (
          <Banner className={className} variant="warning">
            Bei der letzten Nutzung wurde ein Nutzungslimit erreicht.
          </Banner>
        );
    }
  }

  return (
    <Card header={"Daten Quellen"}>
      {getIngestionErrorBanner()}

      <Button onClick={handleIngest} className="flex items-center gap-2 w-full">
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
