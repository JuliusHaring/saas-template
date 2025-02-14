import Headline from "@/lib/components/shared/molecules/Headline";

export default function Impressum() {
  return (
    <>
      <Headline level={1}>Impressum</Headline>

      <div>
        <Headline level={2} block className="my-4">
          Diensteanbieter
        </Headline>
        Angaben gemäß § 5 TMG:
        <br />
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
        <br />
        Julius Haring
        <br />
        Krefelder Straße 197c
        <br />
        52070 Aachen, Deutschland
        <br />
        Steuernummer: 201/5156/6129
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Kontaktmöglichkeiten
        </Headline>
        E-Mail-Adresse:{" "}
        <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Vertretungsberechtigte
        </Headline>
        Vertretungsberechtigt: Julius Haring
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Angaben zum Unternehmen
        </Headline>
        Umsatzsteuer Identifikationsnummer (USt-ID): nicht anwendbar
        <br />
        Geschäftsbereich: Deutschland
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Online-Streitbeilegung (OS)
        </Headline>
        Online-Streitbeilegung: Die Europäische Kommission stellt eine Plattform
        zur Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
        <a href="https://ec.europa.eu/consumers/odr/">
          https://ec.europa.eu/consumers/odr/
        </a>{" "}
        finden. Verbraucher haben die Möglichkeit, diese Plattform für die
        Beilegung ihrer Streitigkeiten zu nutzen.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Streitbeilegung vor einer Verbraucherschlichtungsstelle
        </Headline>
        Angaben zur Teilnahme an der Verbraucherstreitschlichtung: Wir sind
        nicht bereit und nicht verpflichtet an einem Streitbeilegungsverfahren
        vor einer Verbraucherstreitschlichtungsstelle teilzunehmen.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Haftungs- und Schutzrechtshinweise
        </Headline>
        Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig
        und nach unserem aktuellen Kenntnisstand erstellt, dienen jedoch nur der
        Information und entfalten keine rechtlich bindende Wirkung, sofern es
        sich nicht um gesetzlich verpflichtende Informationen (z.B. das
        Impressum, die Datenschutzerklärung, AGB oder verpflichtende Belehrungen
        von Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig
        oder teilweise zu ändern oder zu löschen, soweit vertragliche
        Verpflichtungen unberührt bleiben. Alle Angebote sind freibleibend und
        unverbindlich.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Verantwortlicher
        </Headline>
        Julius Haring
        <br />
        E-Mail-Adresse:{" "}
        <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          Ihre Rechte
        </Headline>
        Sie können Ihr Recht auf Auskunft oder Berichtigung, Löschung und
        Einschränkung der Verarbeitung der Fotografien geltend machen und können
        sich bei der zuständigen Aufsichtsbehörde beschweren. Sie können der
        Verarbeitung von Aufnahmen und Daten, die Sie betreffen, jederzeit
        widersprechen.
      </div>
    </>
  );
}
