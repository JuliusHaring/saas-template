import Card from "@/lib/components/admin/organisms/Card";

const TESTIMONIALS = [
  {
    text: "Dank KnexAI konnten wir unseren Kundenservice automatisieren, ohne an Qualität zu verlieren.",
    subtext: "Restaurant in Aachen",
  },
  {
    text: "Unser Support-Team spart täglich Stunden, weil häufige Anfragen jetzt automatisch beantwortet werden.",
    subtext: "Café in Köln",
  },
  {
    text: "Ich hätte nie gedacht, dass eine KI unsere Buchungsprozesse so verbessern könnte.",
    subtext: "Bäckerei in Bonn",
  },
  {
    text: "Unsere Kunden lieben die schnellen und präzisen Antworten – als hätte man einen echten Mitarbeiter im Chat!",
    subtext: "Modegeschäft in Düsseldorf",
  },
  {
    text: "Wir integrieren KnexAI in unser bestehendes CRM – es funktioniert nahtlos!",
    subtext: "IT-Agentur in Aachen",
  },
  {
    text: "Vorher gingen viele Anfragen unter, jetzt bearbeiten wir alles effizient und zuverlässig.",
    subtext: "Friseursalon in Aachen",
  },
  {
    text: "Unsere Social-Media-Anfragen werden jetzt blitzschnell beantwortet – ein Gamechanger!",
    subtext: "Marketing-Agentur in Bonn",
  },
  {
    text: "Dank KnexAI sind unsere Produktanfragen um 80% schneller beantwortet – die Kunden sind begeistert!",
    subtext: "Elektronik-Shop in Köln",
  },
  {
    text: "Wir haben endlich eine skalierbare Lösung für unseren Kundenservice gefunden!",
    subtext: "IT-Agentur in DÜsseldorf",
  },
  {
    text: "Unsere FAQs sind endlich sinnvoll strukturiert und interaktiv – das spart uns täglich Arbeit.",
    subtext: "Autohaus in Frankfurt",
  },
  {
    text: "Dank der KI-gestützten Chatbot-Lösung von KnexAI haben wir 30% mehr Abschlüsse erzielt!",
    subtext: "Handwerksbetrieb in Düren",
  },
  {
    text: "Unsere Kunden merken nicht einmal, dass sie mit einer KI sprechen – so gut sind die Antworten!",
    subtext: "Startup in Würselen",
  },
];

export default function TestimonialCarousel() {
  return (
    <div className="overflow-hidden w-full relative">
      <Carousel />
    </div>
  );
}

const Carousel = () => {
  return (
    <div className="overflow-hidden mt-20 relative">
      <div className="absolute inset-y-0 left-0 w-30 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-30 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      <div className="flex w-max animate-marquee gap-4 transition-transform ease-in-out duration-700">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((testimony, i) => (
          <Card
            className="bg-blue-500 shadow-lg p-6 text-center w-[400px] h-full hover:bg-blue-600 transition-all duration-500 ease-in-out shadow-xl"
            key={i}
          >
            <div className="flex flex-col items-center p-4">
              <p className="text-lg font-semibold text-white">
                {testimony.text}
              </p>
              <p className="text-sm text-gray-200 mt-2">{testimony.subtext}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
