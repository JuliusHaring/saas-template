import Headline from "@/lib/components/shared/molecules/Headline";
import { CloudUpload, MessageCircle, Globe } from "lucide-react";

export const Explanation: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center mt-10 md:px-20 px-4">
      <p className="text-lg mt-2">
        Integriere einen Chatbot in deine Website – trainiert mit deinen eigenen
        Inhalten.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8 items-start">
        {/* Web Crawling Section */}
        <div className="flex flex-col items-center">
          <Globe className="h-12 w-12 text-blue-500" />
          <div className="flex flex-col items-center mt-4 min-h-[4rem]">
            <Headline level={2}>Wissen aus deiner Website</Headline>
          </div>
          <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
            KnexAI analysiert deine eigene Website und nutzt die Inhalte, um
            deinen Chatbot zu trainieren.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col items-center">
          <CloudUpload className="h-12 w-12 text-green-500" />
          <div className="flex flex-col items-center mt-4 min-h-[4rem]">
            <Headline level={2}>Dokumente als Wissensquelle</Headline>
          </div>
          <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
            Lade PDFs, Word-Dateien, CSVs und viele weitere Formate hoch – dein
            eingebetteter Chatbot kann sie sofort verstehen.
          </p>
        </div>

        {/* Chatbot Section */}
        <div className="flex flex-col items-center">
          <MessageCircle className="h-14 w-14 text-purple-600 animate-pulse" />
          <div className="flex flex-col items-center mt-4 min-h-[4rem]">
            <Headline level={2}>Direkt in deine Website eingebettet</Headline>
          </div>
          <p className="text-gray-500 text-sm text-center max-w-xs mt-2">
            Dein Chatbot ist nahtlos integriert und beantwortet Fragen basierend
            auf deinen Daten.
          </p>
        </div>
      </div>
    </div>
  );
};
