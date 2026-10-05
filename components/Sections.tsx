import { Img } from "./Img";
import { REVIEWS, WEEK } from "@/lib/content";
import { ADDRESS_LINE, CONTACT, MAPS_URL } from "@/lib/site";

export function Storia() {
  return (
    <section id="storia" className="relative overflow-hidden py-24 lg:py-36">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-10">
          <p data-reveal className="eyebrow text-vino">
            La storia
          </p>
          <h2 data-split className="h-section mt-5">
            Tre generazioni, la stessa sala in pietra.
          </h2>
          <div className="prose-osteria mt-8 space-y-5 text-inchiostro/80">
            <p data-reveal>
              Nel 1962 nonna Rina apre un&rsquo;osteria nell&rsquo;ex stalla di famiglia, in fondo al borgo: sei tavoli, un camino e il vino del cugino in damigiana. Si veniva per un piatto di agnolotti dopo la vendemmia.
            </p>
            <p data-reveal>
              Oggi in cucina ci sono i nipoti, ma le travi, i muri e le ricette sono quelli. La pasta si tira a mano ogni mattina, il salame arriva da Varzi, la carne dai pascoli della valle e il vino solo dalle cantine dell&rsquo;Oltrepò.
            </p>
          </div>
          <dl data-reveal className="mt-10 grid grid-cols-3 gap-4 border-t border-inchiostro/15 pt-6">
            {[
              ["40", "coperti in sala"],
              ["30", "nel dehors d'estate"],
              ["100%", "vini dell'Oltrepò"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-serif text-4xl leading-none text-vino">{n}</dd>
                <dd className="mt-2 text-[0.8rem] leading-snug text-inchiostro/65">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative grid grid-cols-6 gap-4 lg:col-span-7 lg:gap-6">
          <figure className="col-span-4 lg:col-span-4">
            <div data-clip className="aspect-[4/5] overflow-hidden rounded-[4px]">
              <Img photo="borgoCasa" sizes="(min-width:1024px) 38vw, 66vw" className="h-full w-full object-cover" />
            </div>
          </figure>
          <figure className="col-span-2 self-end lg:col-span-2">
            <div data-clip className="aspect-[3/4] overflow-hidden rounded-[4px]">
              <Img photo="porta" sizes="(min-width:1024px) 18vw, 32vw" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-xs leading-snug text-inchiostro/60">L&rsquo;ingresso dal vicolo</figcaption>
          </figure>
          <figure className="col-span-6 lg:col-span-5 lg:col-start-2">
            <div data-clip className="aspect-[3/2] overflow-hidden rounded-[4px]">
              <Img photo="maniPasta" sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-xs text-inchiostro/60">Gli agnolotti si chiudono a mano, uno a uno.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Colline() {
  return (
    <section aria-label="Le colline dell'Oltrepò" className="relative h-[78svh] min-h-[460px] overflow-hidden bg-inchiostro text-carta">
      <div className="absolute inset-[-12%_0] will-change-transform" data-parallax="0.18">
        <Img photo="colline" sizes="100vw" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_16_13/0.1),rgb(20_16_13/0.65))]" />
      <div className="wrap relative flex h-full items-end pb-14 lg:pb-20">
        <blockquote>
          <p data-split className="display max-w-[17ch] text-[clamp(2.2rem,1.4rem+4vw,5rem)]">
            &laquo;Quello che cresce su queste colline, finisce nel piatto.&raquo;
          </p>
          <footer data-reveal className="eyebrow mt-6 text-carta/75">
            Vigneti della Valle Versa
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

export function Dehors() {
  return (
    <section aria-labelledby="dehors-title" className="py-24 lg:py-36">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div data-clip className="aspect-[3/2] overflow-hidden rounded-[4px]">
            <Img photo="dehors" sizes="(min-width:1024px) 56vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 lg:pl-8">
          <p data-reveal className="eyebrow text-oliva">
            Da maggio a settembre
          </p>
          <h2 id="dehors-title" data-split className="h-section mt-5">
            Il dehors sotto il pergolato.
          </h2>
          <p data-reveal className="prose-osteria mt-6 text-inchiostro/80">
            Trenta posti all&rsquo;aperto, all&rsquo;ombra del glicine, con le colline davanti. A pranzo si sta al fresco, la sera si cena con le lucine accese finché il cielo non diventa blu.
          </p>
          <p data-reveal className="mt-4 text-sm text-inchiostro/60">
            Volete un tavolo fuori? Scrivetelo nelle note della prenotazione.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-1 text-oro" aria-label={`${n} stelle su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className={i < n ? "" : "opacity-25"}>
          <path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function Recensioni() {
  return (
    <section aria-labelledby="recensioni-title" className="bg-carta-2 py-24 lg:py-32">
      <div className="wrap">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p data-reveal className="eyebrow text-vino">
              Dicono di noi
            </p>
            <h2 id="recensioni-title" data-split className="h-section mt-5 max-w-[16ch]">
              Chi si siede, di solito torna.
            </h2>
          </div>
          <p data-reveal className="inline-flex w-fit items-center gap-2 rounded-full border border-inchiostro/20 px-3 py-1.5 text-xs font-medium text-inchiostro/70">
            Recensioni d&rsquo;esempio · progetto concept
          </p>
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <li key={r.author} data-reveal data-delay={String(i * 0.08)} className="flex flex-col rounded-[6px] bg-carta p-6 shadow-[0_1px_0_rgb(30_25_21/0.06)]">
              <Stars n={r.rating} />
              <blockquote className="mt-5 flex-1 font-serif text-[1.35rem] leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="mt-6 text-sm text-inchiostro/65">
                {r.author} · {r.place}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Orari() {
  const bbox = [CONTACT.lon - 0.012, CONTACT.lat - 0.006, CONTACT.lon + 0.012, CONTACT.lat + 0.006].join("%2C");
  return (
    <section id="orari" aria-labelledby="orari-title" className="bg-inchiostro py-24 text-carta lg:py-32">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-oro">
            Orari e dove siamo
          </p>
          <h2 id="orari-title" data-split className="h-section mt-5">
            In fondo al borgo, dopo la chiesa.
          </h2>
          <table data-reveal className="mt-10 w-full text-[0.98rem]">
            <caption className="sr-only">Orari di apertura</caption>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <tr key={d} className="border-b border-carta/12">
                  <th scope="row" className="py-3 text-left font-medium">
                    {WEEK[d].day}
                  </th>
                  <td className="py-3 text-right text-carta/75">
                    {WEEK[d].slots.length ? WEEK[d].slots.map((s) => `${s.from}–${s.to}`).join(" · ") : "Chiuso"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <address data-reveal className="mt-10 not-italic leading-relaxed text-carta/85">
            {ADDRESS_LINE}
            <br />
            <a href={CONTACT.phoneHref} className="underline decoration-carta/30 underline-offset-4 hover:decoration-carta">
              Tel. {CONTACT.phoneDisplay}
            </a>
          </address>
          <a data-reveal href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light mt-8">
            Indicazioni stradali
          </a>
        </div>
        <div className="lg:col-span-7">
          <div data-clip className="relative h-[380px] overflow-hidden rounded-[6px] bg-fumo lg:h-full lg:min-h-[520px]">
            <iframe
              title={`Mappa: Osteria del Borgo, ${CONTACT.city}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${CONTACT.lat}%2C${CONTACT.lon}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(0.35)_sepia(0.15)]"
            />
          </div>
          <p className="mt-3 text-xs text-carta/55">Mappa © OpenStreetMap contributors. Parcheggio gratuito in piazza, a due minuti a piedi.</p>
        </div>
      </div>
    </section>
  );
}
