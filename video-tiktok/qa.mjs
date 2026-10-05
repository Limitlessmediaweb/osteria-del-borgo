// QA del sito: screenshot full-page mobile/desktop + controlli automatici.
import { chromium, devices } from "playwright-core";
import { mkdirSync } from "node:fs";

const SITE = process.env.SITE || "http://localhost:3140";
const OUT = "../qa/";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const configs = [
  { name: "mobile", opts: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } } },
  { name: "desktop", opts: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
];

for (const c of configs) {
  const ctx = await browser.newContext({ ...c.opts, locale: "it-IT", timezoneId: "Europe/Rome" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}${c.name}-hero.png` });

  // scorri tutta la pagina per attivare le animazioni
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1800);

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflow = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) {
        const s = getComputedStyle(el);
        if (el.closest("[role=tablist], .overflow-x-auto, dialog, [data-split], .split-line")) return;
        if (s.position === "fixed") return;
        overflow.push(`${el.tagName}.${String(el.className).slice(0, 60)} ${Math.round(r.left)}-${Math.round(r.right)}`);
      }
    });
    const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
    const hidden = [...document.querySelectorAll("[data-reveal],[data-split]")].filter((e) => getComputedStyle(e).opacity === "0" || getComputedStyle(e).visibility === "hidden").length;
    const smallTaps = [...document.querySelectorAll("a,button")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.height < 24 || r.width < 24) && !e.closest("footer, .legal");
      })
      .map((e) => (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30));
    return {
      scrollWidth: document.documentElement.scrollWidth,
      vw,
      overflow: overflow.slice(0, 15),
      brokenImgs: imgs,
      hiddenAfterScroll: hidden,
      h1: document.querySelectorAll("h1").length,
      title: document.title,
      smallTaps: smallTaps.slice(0, 10),
    };
  });
  console.log(c.name, JSON.stringify(report, null, 1), "errors:", errors);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}${c.name}-full.png`, fullPage: true });

  // sezioni singole
  for (const id of ["storia", "menu", "galleria", "prenota", "orari", "faq"]) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView(), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}${c.name}-${id}.png` });
  }

  // interazioni: Lenis spento, così i click di Playwright non inseguono lo scroll morbido
  await page.evaluate(() => window.__lenis?.destroy());
  // interazioni: form prenotazione
  await page.evaluate(() => document.getElementById("prenota").scrollIntoView());
  await page.click("#prenota form button[type=submit]");
  await page.waitForTimeout(300);
  const errCount = await page.locator("#prenota .text-\\[\\#b3261e\\]").count();
  const dayBtn = page.locator("#prenota fieldset").first().locator("button:not([disabled])").nth(4);
  await dayBtn.click();
  await page.locator("#prenota fieldset").nth(1).locator("button").last().click();
  await page.locator("#prenota fieldset").nth(2).locator("button").nth(1).click();
  await page.locator("#prenota input[autocomplete=name]").fill("Mario Rossi");
  await page.locator("#prenota input[type=tel]").fill("333 1234567");
  await page.locator("#prenota input[type=checkbox]").check();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}${c.name}-form-filled.png` });
  const [popup] = await Promise.all([ctx.waitForEvent("page", { timeout: 5000 }).catch(() => null), page.click("#prenota form button[type=submit]")]);
  console.log(c.name, "form: errori iniziali", errCount, "popup:", popup ? decodeURIComponent(popup.url()).slice(0, 160) : "nessuno");
  if (popup) await popup.close();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}${c.name}-form-sent.png` });

  // galleria
  await page.evaluate(() => document.getElementById("galleria").scrollIntoView());
  await page.waitForTimeout(800);
  await page.locator("#galleria ul button").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}${c.name}-lightbox.png` });
  await page.keyboard.press("Escape");

  if (c.name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.click("button[aria-controls=menu-mobile]");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}${c.name}-nav.png` });
  }
  await ctx.close();
}

// 404, privacy, robots
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const r = await p.goto(SITE + "/pagina-inesistente");
console.log("404 status", r.status());
await p.screenshot({ path: `${OUT}404.png` });
await p.goto(SITE + "/crediti");
await p.screenshot({ path: `${OUT}crediti.png`, fullPage: true });
console.log((await (await p.goto(SITE + "/robots.txt")).text()).trim());
await browser.close();
