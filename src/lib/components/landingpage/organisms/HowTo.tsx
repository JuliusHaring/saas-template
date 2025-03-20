import { CogIcon, MessageCircle, Plus, ScrollText } from "lucide-react";
import Image from "next/image";

export const HowTo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 border border-gray-200 p-20 md:mx-20 mx-4 items-center">
      {/* Text & Steps */}
      <div className="flex flex-col justify-center">
        <ul className="space-y-6 text-lg">
          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <Plus className="h-6 w-6 text-white bg-blue-500 p-1" />
              Erstelle ChatBots
            </div>
            <p className="text-gray-600 text-base mt-1">
              Gib deinem ChatBot eine eigene Persönlichkeit!
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <CogIcon className="h-6 w-6 text-white bg-blue-500 p-1" />
              Konfiguriere Quellen
            </div>
            <p className="text-gray-600 text-base mt-1">
              Speichere die Adresse deiner Webseite oder lade Dateien hoch.
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <ScrollText className="h-6 w-6 text-white bg-blue-500 p-1" />
              Importiere den ChatBot
            </div>
            <p className="text-gray-600 text-base mt-1">
              Füge eine von KnexAI vorgegebene Script-Zeile in deine Webseite
              ein.
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <MessageCircle className="h-6 w-6 text-white bg-blue-500 p-1" />
              Chatte los!
            </div>
            <p className="text-gray-600 text-base mt-1">
              Lasse deine Kunden auf den ChatBot zugreifen!
            </p>
          </li>
        </ul>
      </div>

      {/* Image Section */}
      <div className="flex items-center justify-center">
        <Image
          src="/images/howto_chat_window.png"
          alt="HowTo: Chat Beispiel"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};
