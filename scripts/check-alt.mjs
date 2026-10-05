// Fallisce se trova <img> senza attributo alt nei sorgenti .tsx.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const bad = [];
const walk = (d) =>
  readdirSync(d).forEach((f) => {
    const p = join(d, f);
    if (statSync(p).isDirectory()) return walk(p);
    if (!p.endsWith(".tsx")) return;
    const src = readFileSync(p, "utf8");
    for (const m of src.matchAll(/<img\b[\s\S]*?\/>/g)) if (!/\balt=/.test(m[0])) bad.push(p);
  });
["app", "components"].forEach(walk);
if (bad.length) {
  console.error("img senza alt:", bad);
  process.exit(1);
}
console.log("alt ok");
