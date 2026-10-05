import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termini d'uso",
  description: "Condizioni d'uso del sito e delle prenotazioni dell'Osteria del Borgo.",
  alternates: { canonical: "/termini" },
};

export default function Termini() {
  return (
    <LegalPage title="Termini d'uso" intro="Bozza da far revisionare prima del lancio.">
      <h2>Il sito</h2>
      <p>Questo sito presenta l&rsquo;Osteria del Borgo, il menù, gli orari e permette di inviare una richiesta di prenotazione. Menù e prezzi sono indicativi e possono cambiare con le stagioni: fa fede il menù in sala.</p>
      <h2>Prenotazioni</h2>
      <p>La richiesta inviata dal sito non è una conferma: il tavolo è prenotato solo quando ti rispondiamo su WhatsApp o per telefono. Se non puoi venire, avvisaci appena possibile al {CONTACT.phoneDisplay}. Teniamo il tavolo 15 minuti dopo l&rsquo;orario prenotato.</p>
      <h2>Comportamento</h2>
      <p>Chiediamo di usare il modulo solo per prenotazioni reali e di non inserire dati di altre persone senza il loro consenso.</p>
      <h2>Responsabilità</h2>
      <p>Facciamo il possibile perché le informazioni siano corrette e aggiornate, ma non possiamo garantire l&rsquo;assenza di errori o interruzioni del sito. I link verso siti esterni (mappe, WhatsApp) sono forniti per comodità.</p>
      <h2>Foto</h2>
      <p>
        Le fotografie sono immagini royalty-free con licenza Unsplash: autori e link sono nella pagina <a href="/crediti">Crediti fotografici</a>.
      </p>
      <h2>Modifiche</h2>
      <p>Possiamo aggiornare questi termini; la versione valida è sempre quella pubblicata su questa pagina.</p>
      <h2>Contatti</h2>
      <p>
        Per domande: {CONTACT.email} o {CONTACT.phoneDisplay}.
      </p>
    </LegalPage>
  );
}
