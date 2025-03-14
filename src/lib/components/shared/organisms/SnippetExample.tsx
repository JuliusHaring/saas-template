import CodeView from "@/lib/components/shared/organisms/CodeView";
import { baseUrl } from "@/lib/utils/base-url";
import { getImportScript } from "@/lib/utils/import-script";

export const SnippetExample: React.FC = () => {
  const script = getImportScript("<ID>")
    .replaceAll(baseUrl, "<URL>")
    .replace("api/chatbot/integrate", "<INTEGRATION_URL>");

  return (
    <div className="space-y-4 md:px-20 px-4">
      <p>
        Kopiere einfach das von KnexAI erstellte Skript und füge es in deiner
        Webseite ein. Dein ChatBot ist dann sofort einsatzbereit!
      </p>
      <h2 className="">Beispiel:</h2>
      <CodeView code={script} />
    </div>
  );
};
