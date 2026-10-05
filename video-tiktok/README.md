# Osteria del Borgo — video "da zero a online" (TikTok / Reels)

Video verticale per il portfolio LIMITLESS. Tutto in codice e con il **sito vero**: niente Higgsfield, niente immagini generate, niente grafica cartoon. Le foto sono quelle reali royalty-free (Unsplash) usate dal sito.

| File | Cosa |
|---|---|
| `osteria-del-borgo-tiktok.mp4` | video finale: 1080x1920, 60 fps costanti, 24,6 s, H.264 High, yuv420p, CRF 17, preset slow, AAC muto, faststart (16,5 MB) |
| `check/contact-sheet.jpg` | 1 fotogramma al secondo con le safe zone TikTok in rosso |
| `clips/scroll/` | scroll vero del sito catturato a tempo virtuale (576 fotogrammi 780x1688) + `meta.json` con i tocchi |
| `assets/stage-*.jpg` | la home in 4 stati: struttura, foto, testi, colori |
| `assets/map.jpg` | mappa OpenStreetMap vera della zona |
| `spot/` | pagina di composizione (HTML + GSAP, timeline in pausa) |

## Struttura (variante skill `limitless-video-sito`)

- **Hook**: (b) "Prima / Dopo" in versione editor — editor vuoto con il cursore, il codice vero di `Hero.tsx` che si scrive + "La tua trattoria merita più *tavoli pieni.*"
- **Presentazione**: telefono realistico in CSS (status bar con il colore campionato dal sito fotogramma per fotogramma)
- **Ritmo**: (c) narrativo, una scena per passaggio, con punch-in leggero sul form
- **Transizioni**: scanline dorata che "costruisce" il sito, crossfade, dissolvenze sfocate
- **Finale**: CTA semplice "Il tuo locale online in 7 giorni." + "Scrivici in DM" + nota concept

| Tempo | Scena |
|---|---|
| 0,0–2,4 | Hook sull'editor |
| 2,4–7,4 | Il sito si costruisce nel telefono: 01 Struttura → 02 Foto (in bianco e nero) → 03 Testi → 04 Colori |
| 7,4–15,4 | Scroll vero: hero → menù (tocco su "Secondi") → galleria → prenotazione (Sab 10, 20:30, 4 persone). Didascalie: "Il menù, con i prezzi." / "La sala, in foto vere." / "Prenotano dal telefono." |
| 15,4–18,4 | "Online.": barra del browser con `osteriadelborgo.it`, risultato di ricerca (titolo e description veri del sito), pin sulla mappa |
| 18,4–21,6 | Schermata di blocco: 8 notifiche "Nuova prenotazione · N persone · sabato hh:mm", contatore tavoli 6 → 14/14, "Sala piena." |
| 21,6–24,6 | CTA + "Progetto concept — Osteria del Borgo è un'attività inventata." |

"LIMITLESS" bianco 60% in alto a destra (dentro la safe zone) da 0,3 s alla fine. Nessun testo nei primi 150 px, negli ultimi 380 px e negli ultimi 140 px a destra.

## Come rifarlo

```bash
# 1. sito in produzione (dalla cartella del sito)
npm run build && npx next start -p 3140
# 2. dalla cartella video-tiktok
npm install
node scripts/capture-site.mjs all     # scroll + stati + mappa
node scripts/preview.mjs 0.5          # stills + contact sheet in preview/
node scripts/render.mjs               # render 60 fps → osteria-del-borgo-tiktok.mp4
python scripts/check.py               # ffprobe, neri/bianchi, salti, contact sheet in check/
```

## Metodo

- **Cattura**: Playwright + Chromium, iPhone 390x844 a DPR 2. `page.clock` sostituisce Date/rAF/timer: GSAP, ScrollTrigger e Lenis avanzano solo di 1/60 s per fotogramma; le animazioni CSS sono messe in pausa e portate avanti a mano. Ogni fotogramma con CDP `Page.captureScreenshot`. Immagini precaricate (niente buchi da lazy loading). Data virtuale: giovedì 8 ottobre 2026.
- **Stati di costruzione**: CSS iniettato nella home vera — testi avvolti in barre grigie, immagini sostituite da riquadri con la X, palette neutra; poi foto in bianco e nero, testi veri, colori veri.
- **Composizione**: `spot/index.html` + `spot/spot.js`, timeline GSAP in pausa, `window.__render(t)`; i fotogrammi vanno direttamente in ffmpeg.
- **Mappa**: © OpenStreetMap contributors (attribuzione visibile nella card).
