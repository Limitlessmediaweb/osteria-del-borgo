import { ADDRESS_LINE, CONTACT, LIMITLESS_URL } from "@/lib/site";
import { WEEK } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-inchiostro text-carta/80">
      <div className="wrap grid grid-cols-1 gap-10 border-t border-carta/10 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl text-carta">Osteria del Borgo</p>
          <p className="mt-3 text-sm leading-relaxed">
            Cucina dell&rsquo;Oltrepò Pavese dal 1962.
            <br />
            {ADDRESS_LINE}
          </p>
        </div>
        <div className="text-sm leading-relaxed">
          <p className="eyebrow mb-3 text-carta/55">Contatti</p>
          <a href={CONTACT.phoneHref} className="block hover:text-carta">
            Tel. {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="block hover:text-carta">
            {CONTACT.email}
          </a>
          <p className="mt-3 text-carta/55">Chiuso il {WEEK[1].day.toLowerCase()}.</p>
        </div>
        <nav aria-label="Pagine legali" className="text-sm leading-loose">
          <p className="eyebrow mb-3 text-carta/55">Informazioni</p>
          <a href="/privacy" className="block hover:text-carta">
            Privacy policy
          </a>
          <a href="/termini" className="block hover:text-carta">
            Termini d&rsquo;uso
          </a>
          <a href="/crediti" className="block hover:text-carta">
            Crediti fotografici
          </a>
        </nav>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-carta/10 py-6 text-xs text-carta/55 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Osteria del Borgo · Attività inventata a scopo dimostrativo</p>
        <p>
          Progetto concept realizzato da{" "}
          <a href={LIMITLESS_URL} target="_blank" rel="noopener" className="font-semibold tracking-[0.08em] text-carta/80 hover:text-carta">
            LIMITLESS
          </a>
        </p>
      </div>
    </footer>
  );
}

