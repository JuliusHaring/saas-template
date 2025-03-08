"use client";
import Card from "@/lib/components/admin/organisms/Card";
import { FileSource } from "@/lib/components/admin/organisms/sources/FileSource";
import { WebsiteSource } from "@/lib/components/admin/organisms/sources/WebsiteSource";
import Divider from "@/lib/components/shared/molecules/Divider";

const ChatBotSources: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  return (
    <Card header={"Daten Quellen"}>
      {process.env.NEXT_PUBLIC_SOURCES_WEBSITE?.toLowerCase() === "true" ? (
        <WebsiteSource chatBotId={chatBotId} />
      ) : (
        <></>
      )}

      <Divider />

      {process.env.NEXT_PUBLIC_SOURCES_FILES?.toLowerCase() === "true" ? (
        <FileSource chatBotId={chatBotId} />
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ChatBotSources;
