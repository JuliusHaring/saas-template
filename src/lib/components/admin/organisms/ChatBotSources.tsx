"use client";
import Card from "@/lib/components/admin/organisms/Card";
import { WebsiteSource } from "@/lib/components/admin/organisms/sources/WebsiteSource";

const ChatBotSources: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  return (
    <Card header={"Daten Quellen"}>
      {process.env.NEXT_PUBLIC_SOURCES_WEBSITE?.toLowerCase() === "true" ? (
        <WebsiteSource chatBotId={chatBotId} />
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ChatBotSources;
