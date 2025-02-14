import Typical from "react-typical";

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
