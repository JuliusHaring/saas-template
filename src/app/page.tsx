"use client";

import NavBar from "@/lib/components/landingpage/organisms/Navbar";
import {
  ChatBubbleBottomCenterIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Element } from "react-scroll";
import Typical from "react-typical";
import Image from "next/image";
import { getImportScript } from "@/lib/utils/import-script";
import { baseUrl } from "@/lib/utils/base-url";
import CodeView from "@/lib/components/shared/organisms/CodeView";

export default function LandingPage() {
  return (
    <div>
      <NavBar className="mb-8" />

      <div className="text-xl lg:px-40 md:px-10 px-4">
        <Element name="eyecatcher">
          <EyeCatcher />
        </Element>
        <Spacing />

        <Element name="howto">
          <HowTo />
        </Element>

        <Element name="code-example">
          <SnippetExample />
        </Element>
        <Spacing amount={40} />
      </div>
    </div>
  );
}

const Spacing: React.FC<{ amount?: number | string }> = ({ amount = 20 }) => {
  return (
    <div
      style={{ marginTop: typeof amount === "number" ? `${amount}px` : amount }}
    />
  );
};

export const EyeCatcher: React.FC = () => {
  const typicalElements: string[] = [
    "Kundensupport",
    "Entertainment",
    "Vertrieb",
    "HR & Recruiting",
    "Leadgenerierung",
    "Automatisierung",
    "Kundenservice",
    "FAQ-Handling",
    "Produktberatung",
    "Technischer Support",
    "Terminplanung",
    "E-Commerce",
    "Healthcare",
    "Bildung & E-Learning",
    "Hotel & Gastronomie",
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="flex justify-center items-center">
      <span className="inline-flex">
        Chatbots für&nbsp;
        <span className="text-blue-600 font-semibold">
          <Typical
            steps={["", 100, ...typicalElements.flatMap((e) => [e, 2000])]}
          />
        </span>
        .
      </span>
    </div>
  );
};

const HowTo: React.FC = () => {
  return (
    <div>
      Wie geht eigentlich...
      <span className="text-blue-600 text-2xl font-bold mb-8">KnexAI</span>?
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
                Momentan wird Webscraping, das automatisierte Auslesen deiner
                Webseite unterstützt. In der Zukunft werden weitere Anbindungen
                (Google Drive, Dropbox, ...) erweitert!
              </p>
            </li>

            <li className="flex flex-col">
              <div className="flex items-center gap-3 text-xl font-semibold">
                <ComputerDesktopIcon className="h-6 w-6 text-white bg-blue-500" />
                Importiere den ChatBot
              </div>
              <p className="text-gray-600 text-base mt-1">
                KnexAI erstellt automatisch Skripte mit welchen du deine
                ChatBots auf deiner Webseite importieren kannst. Dank moderner
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
    </div>
  );
};

const SnippetExample: React.FC = () => {
  const script = getImportScript({
    id: "test",
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
  }).replaceAll(baseUrl, "<URL>");

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">
        Integriere deinen ChatBot mit nur einer Zeile Code!
      </h2>
      <p>
        Kopiere einfach das von KnexAI erstellte Skript und füge es in deiner
        Webseite ein. Dein ChatBot ist dann sofort einsatzbereit!
      </p>
      <h2 className="">Beispiel:</h2>
      <CodeView code={script} />
    </div>
  );
};
