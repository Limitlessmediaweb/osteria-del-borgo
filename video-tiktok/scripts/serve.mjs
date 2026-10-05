// Server statico per la pagina di composizione (video-tiktok/) sulla porta 4330.
// /img/* viene servito dalla cartella public/img del sito (le stesse foto del sito).
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SITE_PUBLIC = fileURLToPath(new URL("../../public", import.meta.url));
const PORT = Number(process.env.PORT || 4330);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const path = decodeURIComponent(url.pathname === "/" ? "/spot/index.html" : url.pathname);
  const base = path.startsWith("/img/") ? SITE_PUBLIC : ROOT;
  const file = normalize(join(base, path));
  if (!file.startsWith(normalize(base)) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "max-age=3600" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`spot server http://localhost:${PORT}`));
