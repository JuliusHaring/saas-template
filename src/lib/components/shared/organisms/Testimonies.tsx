import Card from "@/lib/components/admin/organisms/Card";
import { shuffleArray } from "@/lib/utils/arrays";

const TESTIMONIALS = shuffleArray([
  {
    text: "Dank KnexAI wissen unsere Tanzschüler immer, wann die nächsten Kurse stattfinden – ohne dass wir jede Anfrage manuell beantworten müssen!",
    subtext: "Tanzstudio in Aachen",
  },
  {
    text: "Unser Support-Team erhält jetzt weniger wiederholte Anfragen, da KnexAI alle wichtigen Informationen auf unserer Webseite bereitstellt!",
    subtext: "Café in Köln",
  },
  {
    text: "Unsere Yoga-Schüler können nun selbstständig Kurszeiten und verfügbare Plätze abrufen – das spart uns jede Menge Zeit!",
    subtext: "Yoga-Studio in Aachen",
  },
  {
    text: "Wir müssen nicht mehr ständig E-Mails beantworten – KnexAI erklärt unsere Dienstleistungen, genau wie auf der Webseite!",
    subtext: "Modegeschäft in Düsseldorf",
  },
  {
    text: "Kunden erhalten alle Infos zu unseren Mitgliedschaften und Preisen sofort – keine ständigen Rückfragen mehr!",
    subtext: "Fitnessstudio in Aachen",
  },
  {
    text: "KnexAI hilft unseren Kunden, die richtigen Informationen zu finden, ohne dass wir jedes Mal manuell antworten müssen.",
    subtext: "IT-Agentur in Aachen",
  },
  {
    text: "Tanzschüler können jetzt direkt online nachsehen, welche Kurse für sie passen – und sich gezielt anmelden!",
    subtext: "Tanzschule in Würselen",
  },
  {
    text: "KnexAI informiert unsere Kunden rund um die Uhr über Lieferzeiten und Produktdetails – so sparen wir wertvolle Support-Zeit!",
    subtext: "Online-Shop in Bonn",
  },
  {
    text: "Unsere Kunden erhalten jetzt sofort Antworten auf gängige Fragen zu Preisen und Verfügbarkeiten.",
    subtext: "Hotel in Köln",
  },
  {
    text: "KnexAI gibt unseren Interessenten die wichtigsten Informationen zu unseren Dienstleistungen – das erleichtert den Erstkontakt enorm!",
    subtext: "Beratungsunternehmen in Düsseldorf",
  },
  {
    text: "Unsere Kunden können jetzt direkt über KnexAI nachlesen, welche Automodelle wir aktuell auf Lager haben!",
    subtext: "Autohaus in Aachen",
  },
  {
    text: "Unsere Yoga-Schüler finden alle Informationen zu Kurszeiten, Trainern und freien Plätzen ohne unser Zutun!",
    subtext: "Yoga-Studio in Düsseldorf",
  },
]);

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
      {/* <div className="absolute inset-y-0 left-0 w-30 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-30 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div> */}
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
