"use client";

import NavBar from "@/lib/components/landingpage/organisms/Navbar";
import Typical from "react-typical";

export default function LandingPage() {
  return (
    <div>
      <NavBar className="mb-8" />

      <EyeCatcher />
    </div>
  );
}

const EyeCatcher: React.FC = () => {
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
    <div className="flex justify-center items-center text-xl">
      <span className="inline-flex">
        Chatbots für&nbsp;
        <p className="text-blue-600 font-semibold">
          <Typical
            steps={["", 100, ...typicalElements.flatMap((e) => [e, 2000])]}
          />
        </p>
        .
      </span>
    </div>
  );
};
