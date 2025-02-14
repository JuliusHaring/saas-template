import Headline from "@/lib/components/shared/molecules/Headline";

const Datenschutz = () => {
  return (
    <>
      <Headline level={1}>Datenschutzerklärung</Headline>

      <div>
        <Headline level={2} block className="my-4">
          1. Verantwortliche Stelle
        </Headline>
        Julius Haring
        <br />
        Krefelder Straße 197c
        <br />
        52070 Aachen, Deutschland
        <br />
        E-Mail: <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          2. Erhebung und Speicherung personenbezogener Daten
        </Headline>
        Wir erheben und speichern Ihre personenbezogenen Daten nur im Rahmen der
        gesetzlichen Bestimmungen. Diese Daten werden gelöscht, sobald sie für
        die Zwecke, für die sie erhoben wurden, nicht mehr erforderlich sind.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          3. Datenverarbeitung auf dieser Website
        </Headline>
        Beim Besuch unserer Website werden automatisch Informationen allgemeiner
        Natur erfasst. Diese Informationen beinhalten die Art des Webbrowsers,
        das verwendete Betriebssystem, den Domainnamen Ihres Internet Service
        Providers und ähnliches. Hierbei handelt es sich ausschließlich um
        Informationen, die keine Rückschlüsse auf Ihre Person zulassen.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          4. Nutzung und Weitergabe personenbezogener Daten
        </Headline>
        Eine Weitergabe Ihrer persönlichen Daten an Dritte zu anderen als den im
        Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre
        persönlichen Daten nur an Dritte weiter, wenn:
        <ul className="list-disc ml-5">
          <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben</li>
          <li>
            Die Verarbeitung zur Abwicklung eines Vertrags mit Ihnen
            erforderlich ist
          </li>
          <li>
            Die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung
            erforderlich ist
          </li>
          <li>
            Die Verarbeitung zur Wahrung berechtigter Interessen erforderlich
            ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes
            schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben
          </li>
        </ul>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          5. Ihre Rechte
        </Headline>
        Sie haben das Recht:
        <ul className="list-disc ml-5">
          <li>
            Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu
            verlangen
          </li>
          <li>
            Unverzüglich die Berichtigung unrichtiger oder Vervollständigung
            Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen
          </li>
          <li>
            Die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu
            verlangen
          </li>
          <li>
            Die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
            verlangen
          </li>
          <li>
            Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten
            einzulegen
          </li>
        </ul>
      </div>

      <div>
        <Headline level={2} block className="my-4">
          6. Datensicherheit
        </Headline>
        Wir verwenden innerhalb des Website-Besuchs das verbreitete
        SSL-Verfahren (Secure Socket Layer), das von unserem Hosting-Provider
        Vercel automatisch bereitgestellt wird. Dies gewährleistet eine sichere
        Übertragung Ihrer Daten.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          7. Nutzung von Stripe
        </Headline>
        Für die Abwicklung von Zahlungen nutzen wir den Zahlungsdienstleister
        Stripe. Ihre Zahlungsdaten werden im Rahmen der Zahlungsabwicklung an
        Stripe weitergegeben. Weitere Informationen zum Datenschutz bei Stripe
        finden Sie in der Datenschutzerklärung von Stripe:{" "}
        <a href="https://stripe.com/privacy">https://stripe.com/privacy</a>.
      </div>

      <div>
        <Headline level={2} block className="my-4">
          8. Aktualität und Änderung dieser Datenschutzerklärung
        </Headline>
        Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Februar
        2025. Durch die Weiterentwicklung unserer Website und Angebote darüber
        oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher
        Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
        Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website
        unter <a href="mailto:info@juliusharing.com">info@juliusharing.com</a>{" "}
        abgerufen und ausgedruckt werden.
      </div>
    </>
  );
};

export default Datenschutz;
