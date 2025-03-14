import {
  PlusIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export const HowTo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 border border-gray-200 p-20">
      {/* Text & Steps */}
      <div>
        <ul className="space-y-6 text-lg">
          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <PlusIcon className="h-6 w-6 text-white bg-blue-500" />
              Erstelle ChatBots
            </div>
            <p className="text-gray-600 text-base mt-1">
              Gib deinem ChatBot eine eigene Persönlichkeit!
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <Cog6ToothIcon className="h-6 w-6 text-white bg-blue-500" />
              Konfiguriere Quellen
            </div>
            <p className="text-gray-600 text-base mt-1">
              Momentan werden das Hochladen von Dateien und Webscraping zur
              automatisierten Analyse deiner Webseite unterstützt.
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <ComputerDesktopIcon className="h-6 w-6 text-white bg-blue-500" />
              Importiere den ChatBot
            </div>
            <p className="text-gray-600 text-base mt-1">
              KnexAI erstellt automatisch Skripte mit welchen du deine ChatBots
              auf deiner Webseite importieren kannst. Dank moderner
              Authentifizierung ist dies nur für dich möglich!
            </p>
          </li>

          <li className="flex flex-col">
            <div className="flex items-center gap-3 text-xl font-semibold">
              <ChatBubbleBottomCenterIcon className="h-6 w-6 text-white bg-blue-500" />
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
