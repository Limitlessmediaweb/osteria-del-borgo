"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { WEEK, bookingTimes } from "@/lib/content";
import { CONTACT, whatsappUrl } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Img } from "./Img";

const SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const MAX_ONLINE = 10;

type Day = { iso: string; date: Date; open: boolean };

function nextDays(n: number): Day[] {
  const out: Day[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ iso, date: d, open: WEEK[d.getDay()].slots.length > 0 });
  }
  return out;
}

function longDate(d: Date) {
  return `${WEEK[d.getDay()].day.toLowerCase()} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function Prenota() {
  const uid = useId();
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => setDays(nextDays(14)), []);

  const selected = days.find((d) => d.iso === day) ?? null;
  const services = useMemo(() => {
    if (!selected) return [];
    const now = new Date();
    const isToday = selected.date.toDateString() === now.toDateString();
    const nowMin = now.getHours() * 60 + now.getMinutes() + 60;
    return WEEK[selected.date.getDay()].slots.map((s) => ({
      label: s.label,
      times: bookingTimes(s).filter((t) => !isToday || Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) >= nowMin),
    }));
  }, [selected]);

  const clear = (key: string) => setErrors((e) => {
    if (!(key in e)) return e;
    const next = { ...e };
    delete next[key];
    return next;
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!day) e.day = "Scegli il giorno.";
    if (!time) e.time = "Scegli l'orario.";
    if (name.trim().length < 2) e.name = "Scrivi il tuo nome.";
    if (!/^[+\d][\d\s]{7,15}$/.test(phone.trim())) e.phone = "Inserisci un numero di telefono valido.";
    if (!consent) e.consent = "Serve il consenso per ricontattarti.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selected || !time) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error]")?.focus());
      return;
    }
    const msg = [
      "Buongiorno, vorrei prenotare un tavolo all'Osteria del Borgo.",
      `Giorno: ${longDate(selected.date)}`,
      `Ora: ${time}`,
      `Persone: ${people}`,
      `Nome: ${name.trim()}`,
      `Telefono: ${phone.trim()}`,
      notes.trim() ? `Note: ${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    track("booking_submit", { people });
    // TODO: collegare un gestionale prenotazioni o un endpoint email. Per ora la richiesta parte su WhatsApp.
    window.open(whatsappUrl(msg), "_blank", "noopener");
    setSent(`${longDate(selected.date)} alle ${time}, ${people} ${people === 1 ? "persona" : "persone"}`);
  };

  const chip = (on: boolean, disabled = false) =>
    `rounded-[10px] border text-center transition-colors duration-300 ${
      disabled
        ? "cursor-not-allowed border-inchiostro/10 text-inchiostro/30"
        : on
          ? "border-vino bg-vino text-carta"
          : "border-inchiostro/20 bg-[#fbf8f2] hover:border-inchiostro/60"
    }`;

  return (
    <section id="prenota" aria-labelledby="prenota-title" className="relative py-24 lg:py-36">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow text-vino">
            Prenotazioni
          </p>
          <h2 id="prenota-title" data-split className="h-section mt-5">
            Prenota un tavolo.
          </h2>
          <p data-reveal className="prose-osteria mt-6 text-inchiostro/75">
            Scegli giorno, ora e quante persone siete. Ti confermiamo il tavolo su WhatsApp o con una telefonata, di solito entro un&rsquo;ora.
          </p>
          <p data-reveal className="mt-6 text-sm text-inchiostro/65">
            Più di {MAX_ONLINE} persone o per oggi a pranzo?{" "}
            <a href={CONTACT.phoneHref} onClick={() => track("phone_click", { location: "prenota" })} className="font-semibold text-vino underline underline-offset-4">
              Chiamaci al {CONTACT.phoneDisplay}
            </a>
          </p>
          <div data-clip className="mt-10 hidden aspect-[4/5] overflow-hidden rounded-[4px] lg:block">
            <Img photo="vino" sizes="30vw" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-8">
          {sent ? (
            <div role="status" className="rounded-[8px] bg-carta-2 p-8 lg:p-12">
              <p className="eyebrow text-oliva">Quasi fatto</p>
              <p className="mt-4 font-serif text-3xl leading-tight lg:text-4xl">Ti abbiamo aperto WhatsApp con la richiesta già scritta: premi invia.</p>
              <p className="mt-4 text-inchiostro/70">Richiesta: {sent}. Se WhatsApp non si è aperto, chiamaci al {CONTACT.phoneDisplay}.</p>
              <button type="button" onClick={() => setSent(null)} className="btn btn-ghost mt-8">
                Modifica la prenotazione
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} data-reveal className="rounded-[8px] bg-carta-2 p-5 sm:p-8 lg:p-10" aria-describedby={`${uid}-req`}>
              <fieldset>
                <legend className="text-sm font-semibold">1. Giorno</legend>
                <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-7 sm:px-0" data-lenis-prevent>
                  {days.length === 0 && <div className="h-[72px]" />}
                  {days.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      disabled={!d.open}
                      aria-pressed={day === d.iso}
                      aria-label={`${longDate(d.date)}${d.open ? "" : ", chiuso"}`}
                      onClick={() => {
                        setDay(d.iso);
                        setTime(null);
                        clear("day");
                      }}
                      data-error={errors.day ? "" : undefined}
                      className={`${chip(day === d.iso, !d.open)} flex min-h-[72px] w-[62px] shrink-0 flex-col items-center justify-center sm:w-auto`}
                    >
                      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] opacity-80">{SHORT[d.date.getDay()]}</span>
                      <span className="font-serif text-2xl leading-none">{d.date.getDate()}</span>
                      <span className="text-[0.68rem] opacity-70">{d.open ? MONTHS[d.date.getMonth()] : "chiuso"}</span>
                    </button>
                  ))}
                </div>
                {errors.day && <p className="mt-2 text-sm text-[#b3261e]">{errors.day}</p>}
              </fieldset>

              <fieldset className="mt-8">
                <legend className="text-sm font-semibold">2. Ora</legend>
                {!selected && <p className="mt-3 text-sm text-inchiostro/55">Scegli prima il giorno.</p>}
                {services.map((s) => (
                  <div key={s.label} className="mt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-inchiostro/55">{s.label}</p>
                    {s.times.length === 0 ? (
                      <p className="text-sm text-inchiostro/55">Per oggi non si prenota più online: chiamaci.</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {s.times.map((t) => (
                          <button key={t} type="button" aria-pressed={time === t} onClick={() => {
                            setTime(t);
                            clear("time");
                          }} className={`${chip(time === t)} min-h-[46px] text-[0.95rem] tabular-nums`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {errors.time && <p className="mt-2 text-sm text-[#b3261e]">{errors.time}</p>}
              </fieldset>

              <fieldset className="mt-8">
                <legend className="text-sm font-semibold">3. Persone</legend>
                <div className="mt-3 flex items-center gap-4">
                  <button type="button" onClick={() => setPeople((p) => Math.max(1, p - 1))} disabled={people <= 1} className={`${chip(false, people <= 1)} h-12 w-12 text-xl`} aria-label="Una persona in meno">
                    −
                  </button>
                  <output aria-live="polite" className="min-w-[7ch] text-center font-serif text-3xl tabular-nums">
                    {people} <span className="font-sans text-base text-inchiostro/60">{people === 1 ? "persona" : "persone"}</span>
                  </output>
                  <button type="button" onClick={() => setPeople((p) => Math.min(MAX_ONLINE, p + 1))} disabled={people >= MAX_ONLINE} className={`${chip(false, people >= MAX_ONLINE)} h-12 w-12 text-xl`} aria-label="Una persona in più">
                    +
                  </button>
                </div>
              </fieldset>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className="text-sm font-semibold">
                    Nome
                  </label>
                  <input id={`${uid}-name`} className="form-field mt-2" autoComplete="name" value={name} onChange={(e) => {
                      setName(e.target.value);
                      clear("name");
                    }} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-e` : undefined} />
                  {errors.name && (
                    <p id={`${uid}-name-e`} className="mt-1.5 text-sm text-[#b3261e]">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${uid}-phone`} className="text-sm font-semibold">
                    Telefono
                  </label>
                  <input id={`${uid}-phone`} type="tel" inputMode="tel" className="form-field mt-2" autoComplete="tel" value={phone} onChange={(e) => {
                      setPhone(e.target.value);
                      clear("phone");
                    }} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-e` : undefined} />
                  {errors.phone && (
                    <p id={`${uid}-phone-e`} className="mt-1.5 text-sm text-[#b3261e]">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-notes`} className="text-sm font-semibold">
                    Note <span className="font-normal text-inchiostro/55">(facoltative: allergie, seggiolone, tavolo fuori…)</span>
                  </label>
                  <textarea id={`${uid}-notes`} rows={3} className="form-field mt-2 resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-inchiostro/75">
                <input type="checkbox" checked={consent} onChange={(e) => {
                    setConsent(e.target.checked);
                    clear("consent");
                  }} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-vino)]" aria-invalid={!!errors.consent} />
                <span>
                  Acconsento a essere ricontattato per confermare la prenotazione, come descritto nella{" "}
                  <a href="/privacy" className="underline underline-offset-4">
                    privacy policy
                  </a>
                  .
                </span>
              </label>
              {errors.consent && <p className="mt-1.5 text-sm text-[#b3261e]">{errors.consent}</p>}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p id={`${uid}-req`} className="text-xs text-inchiostro/55">
                  La richiesta parte su WhatsApp: il tavolo è confermato quando ti rispondiamo.
                </p>
                <button type="submit" className="btn btn-vino">
                  Invia la richiesta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
