import Headline from "@/lib/components/shared/molecules/Headline";
import CodeView from "@/lib/components/shared/organisms/CodeView";
import { baseUrl } from "@/lib/utils/base-url";
import { getImportScript } from "@/lib/utils/import-script";

export const SnippetExample: React.FC = () => {
  const script = getImportScript({
    id: "<ID>",
    name: "Test ChatBot",
    Style: null,
    GDriveSource: null,
    WebsiteSource: null,
    Documents: [],
    userId: "",
    allowedDomains: [],
    instructions: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
    .replaceAll(baseUrl, "<URL>")
    .replace("api/chatbot/integrate", "<INTEGRATION_URL>");

  return (
    <div className="space-y-4 mt-6">
      <Headline level={2}>
        Integriere deinen ChatBot mit nur einer Zeile Code!
      </Headline>
      <p>
        Kopiere einfach das von KnexAI erstellte Skript und füge es in deiner
        Webseite ein. Dein ChatBot ist dann sofort einsatzbereit!
      </p>
      <h2 className="">Beispiel:</h2>
      <CodeView code={script} />
    </div>
  );
};
