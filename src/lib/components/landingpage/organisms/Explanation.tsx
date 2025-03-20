import Headline from "@/lib/components/shared/molecules/Headline";
import { CloudUpload, MessageCircle, Globe } from "lucide-react";

export const Explanation: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center md:px-20 px-4">
      <p className="text-lg mt-2">
        Automatisiere das Crawlen von Webseiten oder lade deine eigenen Dateien
        hoch.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
        {/* Web Crawling Section */}
        <div className="flex flex-col items-center space-y-4">
          <Globe className="h-12 w-12 text-blue-500" />
          <Headline level={2}>Webseiten Crawlen</Headline>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            KnexAI scannt Webseiten und extrahiert automatisch relevante
            Inhalte.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <CloudUpload className="h-12 w-12 text-green-500" />
          <Headline level={2}>Dateien hochladen</Headline>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Lade PDFs, Word-Dateien, CSVs und viele weitere Formate hoch und
            mache sie durchsuchbar.
          </p>
        </div>

        {/* Chatbot Section */}
        <div className="flex flex-col items-center space-y-4">
          <MessageCircle className="h-14 w-14 text-purple-600 animate-pulse" />
          <Headline level={2}>Direkt nutzbarer Chatbot</Headline>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Deine Daten sind sofort als intelligenter Chat verfügbar.
          </p>
        </div>
      </div>
    </div>
  );
};
