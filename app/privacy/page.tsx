import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Come l'Osteria del Borgo tratta i dati personali raccolti con le prenotazioni, WhatsApp e il sito web.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" intro="Bozza da far revisionare prima del lancio. Il sito è un progetto concept: titolare e dati di contatto sono da definire.">
      <h2>Titolare del trattamento</h2>
      <p>Il titolare del trattamento è [DA DEFINIRE: ragione sociale, partita IVA, sede legale], che gestisce l&rsquo;Osteria del Borgo. Per qualsiasi richiesta: {CONTACT.email}.</p>
      <h2>Quali dati raccogliamo</h2>
      <ul>
        <li>Dati della prenotazione: nome, numero di telefono, giorno, ora, numero di persone ed eventuali note (per esempio allergie).</li>
        <li>Messaggi che ci invii su WhatsApp, per telefono o via email.</li>
        <li>Dati tecnici di navigazione in forma aggregata e anonima, se le statistiche sono attive.</li>
      </ul>
      <h2>Perché li usiamo e su quale base</h2>
      <ul>
        <li>Gestire e confermare la prenotazione: misure precontrattuali richieste da te (art. 6.1.b GDPR).</li>
        <li>Gestire allergie e intolleranze che ci comunichi: tuo consenso esplicito (art. 9.2.a GDPR), solo per servirti in sicurezza.</li>
        <li>Statistiche anonime sull&rsquo;uso del sito: legittimo interesse a migliorare il servizio (art. 6.1.f GDPR).</li>
      </ul>
      <h2>WhatsApp</h2>
      <p>Il modulo di prenotazione prepara un messaggio che invii tu tramite WhatsApp. Il servizio è fornito da WhatsApp Ireland Ltd., che tratta i dati secondo la propria informativa. Puoi sempre prenotare per telefono.</p>
      <h2>Per quanto tempo</h2>
      <p>I dati delle prenotazioni sono conservati per il tempo necessario alla gestione del servizio e comunque non oltre 12 mesi, salvo obblighi di legge.</p>
      <h2>Minori</h2>
      <p>Il sito non è rivolto ai minori di 14 anni e non raccogliamo consapevolmente i loro dati.</p>
      <h2>Statistiche e cookie</h2>
      <p>Il sito non usa cookie di profilazione. Se attive, le statistiche usano Plausible Analytics, che non installa cookie e non raccoglie dati personali. La mappa è fornita da OpenStreetMap.</p>
      <h2>A chi li comunichiamo</h2>
      <p>Non vendiamo né cediamo i tuoi dati. Possono accedervi solo il personale dell&rsquo;osteria e i fornitori tecnici (hosting del sito), nominati responsabili del trattamento.</p>
      <h2>I tuoi diritti</h2>
      <p>Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento scrivendo a {CONTACT.email}. Puoi anche presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>
      <p className="text-sm text-inchiostro/55">Ultimo aggiornamento: 5 ottobre 2026.</p>
    </LegalPage>
  );
}
