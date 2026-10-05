# Osteria del Borgo — sito concept LIMITLESS

Trattoria di paese (inventata) nell'Oltrepò Pavese. Livello **Standard** della skill `sito-wow-premium`: una home lunga ben animata + privacy, termini, crediti fotografici e 404.

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 (token in `@theme`) · GSAP + SplitText + ScrollTrigger · Lenis · font locali (Cormorant Garamond + Figtree).

## Avvio

```bash
npm install
npm run build && npm run start   # http://localhost:3140
npm run check:alt                # fallisce se un <img> non ha alt
```

## Sezioni della home

Hero a foto piena con "Prenota un tavolo" e orario di oggi · Storia · Colline (citazione in parallasse) · Menù a schede (Antipasti, Primi, Secondi, Dolci, Vini) con prezzi · Dehors · Galleria con lightbox · Recensioni (**etichettate come d'esempio**) · Prenotazione (giorno sui prossimi 14 giorni con i giorni di chiusura disattivati, orari a slot di 15 minuti per pranzo/cena, persone 1–10, nome, telefono, note, consenso) · Orari + mappa OpenStreetMap · FAQ (JSON-LD `FAQPage`) · Footer con "Progetto concept realizzato da LIMITLESS" · Pulsante WhatsApp fisso.

Il form non ha backend: valida i campi e apre WhatsApp con la richiesta già scritta (`// TODO` in `components/Prenota.tsx` per collegare un gestionale).

## Foto

25 foto reali royalty-free da Unsplash, scaricate in `public/img` in tre larghezze (640/1200/2400, WebP). Autori e link in `lib/images.ts` e nella pagina `/crediti`. Gli originali di lavoro sono in `raw-media/`.

## Decisioni prese in autonomia

- Livello Standard, niente intro animata: l'hero stesso è l'animazione d'ingresso (foto che si assesta + titolo riga per riga).
- Animazioni solo fade/reveal (clip-path dal basso, SplitText, parallasse leggera), nessun rimbalzo; con `prefers-reduced-motion` tutto è subito visibile.
- Indirizzo, telefono e WhatsApp sono **dimostrativi** (`lib/site.ts`); comune reale (Santa Maria della Versa) ma via inventata.
- Indicizzazione spenta di default: `robots.txt` con `Disallow: /` e `noindex`. Al lancio: `NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL=https://dominio`.
- Analytics: Plausible solo se è impostata `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (eventi `cta_click`, `booking_submit`, `whatsapp_click`, `menu_tab`, `phone_click`).

## Verifica (Playwright, `video-tiktok/qa.mjs`)

Mobile 390x844 e desktop 1440x900: nessuno scroll orizzontale, nessuna immagine rotta, nessun errore in console, una sola `h1`, form (errori → compilazione → apertura WhatsApp con il testo giusto), lightbox, menu mobile, 404 con status 404, robots.txt. Screenshot in `qa/`.

Problemi trovati e risolti: pagina mobile larga 1032 px (fieldset e griglie senza `min-width: 0`), citazione sulle colline una parola per riga su desktop, errori del form che restavano dopo la correzione, pulsante WhatsApp troppo ingombrante su mobile, trigger delle animazioni sfasati dopo il cambio di scheda del menù.

## Video

Vedi `video-tiktok/README.md`.
