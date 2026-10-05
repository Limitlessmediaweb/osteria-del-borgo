// Stills di controllo: renderizza alcuni istanti dello spot e crea un contact sheet con le safe zone TikTok.
// Uso: node scripts/preview.mjs [passo_in_secondi | lista,di,secondi]   (default 1)
import { chromium } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const arg = process.argv[2] || "1";
const OUT = fileURLToPath(new URL("../preview/", import.meta.url));
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const server = spawn(process.execPath, [fileURLToPath(new URL("./serve.mjs", import.meta.url))], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 700));
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
page.on("pageerror", (e) => console.error("pageerror", e.message));
await page.goto("http://localhost:4330/spot/index.html");
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) throw new Error(err);
const DUR = await page.evaluate(() => window.__DUR);
const times = arg.includes(",") ? arg.split(",").map(Number) : Array.from({ length: Math.floor(DUR / Number(arg)) + 1 }, (_, i) => +(i * Number(arg)).toFixed(2)).filter((t) => t < DUR);
for (const t of times) {
  await page.evaluate((x) => window.__render(x), t);
  await page.screenshot({ path: `${OUT}${t.toFixed(2).padStart(6, "0")}.jpg`, type: "jpeg", quality: 88 });
}
await b.close();
server.kill();
execFileSync("python", [fileURLToPath(new URL("./sheet.py", import.meta.url)), OUT, fileURLToPath(new URL("../preview/contact-sheet.jpg", import.meta.url))], { stdio: "inherit" });
console.log(`✓ ${times.length} stills`);
