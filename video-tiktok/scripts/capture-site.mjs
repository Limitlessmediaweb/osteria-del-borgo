// Cattura del sito VERO fotogramma per fotogramma, a tempo virtuale (metodo VOLTA/FLUSSO).
//
// page.clock sostituisce Date, performance.now, setTimeout e requestAnimationFrame prima del caricamento:
// GSAP, ScrollTrigger e Lenis avanzano solo con clock.runFor(16,67 ms). Le animazioni/transizioni CSS
// vengono messe in pausa e portate avanti a mano di 1/60 s. Ogni fotogramma: CDP Page.captureScreenshot.
//
// Uso: node scripts/capture-site.mjs [scroll|stages|map|all]
//   scroll  → clips/scroll/frames/*.jpg  (780x1688, iPhone 390x844 @2x)
//   stages  → assets/stage-{wire,foto,testi,colori}.jpg  (la home in 4 stati: struttura, foto, testi, colori)
//   map     → assets/map.jpg  (mappa OpenStreetMap vera, stessa zona del sito)
import { chromium, devices } from "playwright-core";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE = process.env.SITE || "http://localhost:3140";
const FPS = 60;
const DT = 1000 / FPS;
const ROOT = new URL("../", import.meta.url);
const which = process.argv[2] || "all";

const MOBILE = {
  ...devices["iPhone 13"],
  viewport: { width: 390, height: 844 },
  screen: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "it-IT",
  timezoneId: "Europe/Rome",
};
// Giovedì 8 ottobre 2026: nel form compaiono "Sab 10", e l'hero dice "Oggi 12:15–14:30 · 19:30–22:30"
const T0 = new Date("2026-10-08T10:00:00").getTime();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

async function openVirtual() {
  const ctx = await browser.newContext(MOBILE);
  await ctx.addInitScript(() => {
    window.__stepAnims = (dt) => {
      for (const a of document.getAnimations()) {
        if (a.__vt === undefined) a.__vt = a.currentTime || 0;
        a.pause();
        a.__vt += dt;
        a.currentTime = a.__vt;
      }
    };
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = "::-webkit-scrollbar{display:none!important} html{scrollbar-width:none!important}";
      document.head.appendChild(s);
    });
  });
  const page = await ctx.newPage();
  await page.clock.install({ time: T0 });
  await page.clock.pauseAt(T0 + 1000);
  await page.goto(SITE + "/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // aspetta in tempo reale che le immagini dell'hero siano decodificate, senza far avanzare il tempo virtuale
  // tutte le immagini caricate e decodificate in anticipo (il lazy loading lascerebbe buchi nei fotogrammi)
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  for (let i = 0; i < 100 && !(await page.evaluate(() => !!window.__lenis)); i++) {
    await page.clock.runFor(4);
    await sleep(50);
  }
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}

async function tick(page) {
  await page.clock.runFor(DT);
  await page.evaluate((dt) => window.__stepAnims(dt), DT);
}

const scrollTo = (sel, duration, offset = 0) => async (page) => {
  await page.evaluate(
    ({ sel, duration, offset }) => {
      const el = document.querySelector(sel);
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      const easing = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // easeInOutCubic
      window.__lenis.scrollTo(y, { duration, easing, force: true });
    },
    { sel, duration, offset },
  );
  return { scroll: sel };
};

const tap = (locatorFn, label) => async (page) => {
  const box = await locatorFn(page).boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.touchscreen.tap(x, y);
  return { tap: { x, y, label } };
};

async function record(name, { page, cdp }, dur, actions) {
  const dir = new URL(`clips/${name}/frames/`, ROOT);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const n = Math.round(dur * FPS);
  const meta = { name, fps: FPS, frames: n, events: [] };
  const queue = [...actions].sort((a, b) => a.at - b.at);
  for (let i = 0; i < n; i++) {
    const t = i / FPS;
    while (queue.length && queue[0].at <= t + 1e-6) {
      const a = queue.shift();
      const ev = await a.run(page, t);
      if (ev) meta.events.push({ t, ...ev });
    }
    await tick(page);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 94 });
    writeFileSync(new URL(`${String(i).padStart(5, "0")}.jpg`, dir), Buffer.from(data, "base64"));
    if (i % 60 === 0) process.stdout.write(`${name} ${t.toFixed(1)}s `);
  }
  writeFileSync(new URL(`clips/${name}/meta.json`, ROOT), JSON.stringify(meta, null, 2));
  console.log(`\n✓ ${name}: ${n} fotogrammi`);
}

// 1) SCROLL nel telefono: hero (animazione d'ingresso) → menù (tocco su "Secondi") → galleria → prenota (Sab 10, 20:30, 4 persone)
if (which === "all" || which === "scroll") {
  const s = await openVirtual();
  const days = (p) => p.locator("#prenota fieldset").first().locator("button", { hasText: "10" }).first();
  await record("scroll", s, 9.6, [
    { at: 1.9, run: scrollTo("#menu", 1.2, 60) },
    { at: 3.6, run: tap((p) => p.locator('#menu [role=tab]:has-text("Secondi")'), "Secondi") },
    { at: 4.3, run: scrollTo("#galleria", 1.1, 70) },
    { at: 6.8, run: scrollTo("#prenota form", 0.9, -90) },
    { at: 7.9, run: tap(days, "Sab 10") },
    { at: 8.35, run: tap((p) => p.locator('#prenota button[aria-pressed]:has-text("20:30")'), "20:30") },
    { at: 8.8, run: tap((p) => p.locator('#prenota button[aria-label="Una persona in più"]'), "+") },
    { at: 9.1, run: tap((p) => p.locator('#prenota button[aria-label="Una persona in più"]'), "+") },
  ]);
  await s.ctx.close();
}

// 2) STATI DI COSTRUZIONE: la stessa home (hero + inizio storia) in 4 stati
if (which === "all" || which === "stages") {
  const ctx = await browser.newContext({ ...MOBILE, viewport: { width: 390, height: 1560 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.clock.install({ time: T0 });
  await page.goto(SITE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      [data-hero]{min-height:844px!important;height:844px!important}
      [data-wa]{display:none!important}
      html.st-gray img{filter:grayscale(1) contrast(1.04)}
      html.st-neutral{--color-carta:#ffffff;--color-carta-2:#f2f2f0;--color-inchiostro:#2b2b2b;--color-fumo:#3a3a3a;--color-vino:#3d3d3d;--color-vino-scuro:#222;--color-oro:#a3a3a3;--color-oliva:#8a8a8a}
      html.st-wire{--color-carta:#ffffff;--color-carta-2:#f4f4f2;--color-inchiostro:#b9b9b9;--color-fumo:#ececec;--color-vino:#dedede;--color-vino-scuro:#d0d0d0;--color-oro:#cfcfcf;--color-oliva:#cfcfcf}
      html.st-wire [data-hero]{background:#ebebe9!important;color:#bdbdbd!important}
      html.st-wire.st-noimg img{opacity:0!important}
      html.st-wire.st-noimg [data-hero] .absolute.inset-0 > div{display:none}
      html.st-wire .wf-box:not(.absolute){position:relative}
      html.st-wire .wf-box{background:#e7e7e4!important;outline:1px solid #d4d4d0;outline-offset:-1px}
      html.st-wire.st-noimg .wf-box::after{content:"";position:absolute;inset:0;background:
        linear-gradient(to top right,transparent calc(50% - .6px),#cfcfcb calc(50% - .6px),#cfcfcb calc(50% + .6px),transparent calc(50% + .6px)),
        linear-gradient(to bottom right,transparent calc(50% - .6px),#cfcfcb calc(50% - .6px),#cfcfcb calc(50% + .6px),transparent calc(50% + .6px))}
      html.st-wire .wf-t{color:transparent!important;background:#dcdcd9;border-radius:4px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
      html.st-wire [data-hero] .wf-t{background:rgba(255,255,255,.34)}
      html.st-wire.st-noimg [data-hero] .wf-t{background:#d3d3d0}
      html.st-wire .btn{background:transparent!important;border:1.5px solid #cfcfcb!important}
      html.st-wire header{background:#fff!important;box-shadow:0 1px 0 #e3e3e0!important}
      html.st-wire header .wf-t{background:#dcdcd9}
      html.st-wire header span.bg-current{background:#cfcfcb!important}
    `,
  });
  await page.evaluate(() => {
    // avvolge ogni testo in uno span "barra" per il wireframe
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.textContent.trim() && !n.parentElement.closest("script,style,iframe,svg") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const s = document.createElement("span");
      s.className = "wf-t";
      n.parentNode.insertBefore(s, n);
      s.appendChild(n);
    });
    document.querySelectorAll("img").forEach((i) => {
      if (i.closest("[data-hero]")) return; // l'hero ha già il suo riquadro
      (i.closest("[data-clip]") || i.parentElement).classList.add("wf-box");
    });
    document.querySelector("[data-hero] .absolute.inset-0").classList.add("wf-box");
  });
  const states = {
    wire: ["st-wire", "st-noimg"],
    foto: ["st-wire", "st-gray"],
    testi: ["st-neutral", "st-gray"],
    colori: [],
  };
  mkdirSync(new URL("assets/", ROOT), { recursive: true });
  for (const [name, cls] of Object.entries(states)) {
    await page.evaluate((cls) => {
      document.documentElement.classList.remove("st-wire", "st-noimg", "st-neutral", "st-gray");
      cls.forEach((c) => document.documentElement.classList.add(c));
    }, cls);
    await page.waitForTimeout(400);
    await page.screenshot({ path: fileURLToPath(new URL(`assets/stage-${name}.jpg`, ROOT)), type: "jpeg", quality: 94 });
    console.log("✓ stage", name);
  }
  await ctx.close();
}

// 3) MAPPA vera (OpenStreetMap), senza marker: il pin lo disegna lo spot
if (which === "all" || which === "map") {
  const ctx = await browser.newContext({ viewport: { width: 470, height: 560 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const lat = 44.9887, lon = 9.2986;
  const bbox = [lon - 0.009, lat - 0.0075, lon + 0.009, lat + 0.0075].join("%2C");
  await page.goto(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: ".leaflet-control-container{display:none!important}" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: fileURLToPath(new URL("assets/map.jpg", ROOT)), type: "jpeg", quality: 92 });
  console.log("✓ map");
  await ctx.close();
}

await browser.close();
