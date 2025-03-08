import Card from "@/lib/components/admin/organisms/Card";
import Headline from "@/lib/components/shared/molecules/Headline";

export const FileSource: React.FC<{ chatBotId: string }> = ({ chatBotId }) => {
  return (
    <>
      <Card className="mt-4" header={Header} footer={Footer}>
        {chatBotId}
      </Card>
    </>
  );
};

const Header = <Headline level={3}>Datei Upload</Headline>;

const Footer = <>Senden</>;
