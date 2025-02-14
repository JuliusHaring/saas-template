import Headline from "@/lib/components/shared/molecules/Headline";

export default function Impressum() {
  return (
    <>
      <Headline level={1}>Impressum</Headline>

      <div>
        <h2>Diensteanbieter</h2>
        <p>Angaben gemäß § 5 TMG:</p>
        <p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</p>
        <p>
          Julius Haring
          <br />
          Krefelder Straße 197c
          <br />
          52070 Aachen, Deutschland
          <br />
          Steuernummer: 201/5156/6129
        </p>
      </div>

      <div>
        <h2>Kontaktmöglichkeiten</h2>
        <p>
          E-Mail-Adresse:{" "}
          <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
        </p>
      </div>

      <div>
        <h2>Vertretungsberechtigte</h2>
        <p>Vertretungsberechtigt: Julius Haring</p>
      </div>

      <div>
        <h2>Angaben zum Unternehmen</h2>
        <p>
          Umsatzsteuer Identifikationsnummer (USt-ID): nicht anwendbar
          <br />
          Geschäftsbereich: Deutschland
        </p>
      </div>

      <div>
        <h2>Online-Streitbeilegung (OS)</h2>
        <p>
          Online-Streitbeilegung: Die Europäische Kommission stellt eine
          Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{" "}
          <a href="https://ec.europa.eu/consumers/odr/">
            https://ec.europa.eu/consumers/odr/
          </a>{" "}
          finden. Verbraucher haben die Möglichkeit, diese Plattform für die
          Beilegung ihrer Streitigkeiten zu nutzen.
        </p>
      </div>

      <div>
        <h2>Streitbeilegung vor einer Verbraucherschlichtungsstelle</h2>
        <p>
          Angaben zur Teilnahme an der Verbraucherstreitschlichtung: Wir sind
          nicht bereit und nicht verpflichtet an einem Streitbeilegungsverfahren
          vor einer Verbraucherstreitschlichtungsstelle teilzunehmen.
        </p>
      </div>

      <div>
        <h2>Haftungs- und Schutzrechtshinweise</h2>
        <p>
          Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden
          sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, dienen
          jedoch nur der Information und entfalten keine rechtlich bindende
          Wirkung, sofern es sich nicht um gesetzlich verpflichtende
          Informationen (z.B. das Impressum, die Datenschutzerklärung, AGB oder
          verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns
          vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen,
          soweit vertragliche Verpflichtungen unberührt bleiben. Alle Angebote
          sind freibleibend und unverbindlich.
        </p>
      </div>

      <div>
        <h2>Verantwortlicher</h2>
        <p>
          Julius Haring
          <br />
          E-Mail-Adresse:{" "}
          <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
        </p>
      </div>

      <div>
        <h2>Ihre Rechte</h2>
        <p>
          Sie können Ihr Recht auf Auskunft oder Berichtigung, Löschung und
          Einschränkung der Verarbeitung der Fotografien geltend machen und
          können sich bei der zuständigen Aufsichtsbehörde beschweren. Sie
          können der Verarbeitung von Aufnahmen und Daten, die Sie betreffen,
          jederzeit widersprechen.
        </p>
      </div>
    </>
  );
}
