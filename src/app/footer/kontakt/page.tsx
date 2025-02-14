import Headline from "@/lib/components/shared/molecules/Headline";

const Kontakt = async () => {
  return (
    <>
      <Headline level={1}>Kontakt</Headline>

      <div>
        <Headline level={2} block className="my-4">
          Kontaktinformationen
        </Headline>
        Sie können uns jederzeit erreichen:{" "}
        <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Konto löschen
        </Headline>
        Wenn Sie Ihr Konto löschen möchten, kontaktieren Sie uns bitte direkt
        per E-Mail:
        <br />
        E-Mail-Adresse:{" "}
        <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
        <br />
        Bitte geben Sie in Ihrer Nachricht Ihren vollständigen Namen und Ihre
        E-Mail-Adresse an, damit wir Ihr Konto schnell und effizient löschen
        können.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Zukünftige Funktionen
        </Headline>
        Unser Service wird kontinuierlich weiterentwickelt und es werden in
        Zukunft viele neue Funktionen hinzugefügt. Bleiben Sie dran!
      </div>
    </>
  );
};

export default Kontakt;
