// Render dello spot fotogramma per fotogramma (CDP Page.captureScreenshot) direttamente in ffmpeg.
// Export: 1080x1920, 60 fps costanti, H.264 High, yuv420p, CRF 17, preset slow, traccia audio AAC muta, faststart.
// Uso: node scripts/render.mjs
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const FPS = 60;
const OUT = fileURLToPath(new URL("../osteria-del-borgo-tiktok.mp4", import.meta.url));

const server = spawn(process.execPath, [fileURLToPath(new URL("./serve.mjs", import.meta.url))], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 700));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.error("pageerror", e.message));
await page.goto("http://localhost:4330/spot/index.html");
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) throw new Error(err);
const DUR = await page.evaluate(() => window.__DUR);
const N = Math.round(DUR * FPS);
const cdp = await ctx.newCDPSession(page);

const ff = spawn("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "warning",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
  "-filter_complex", "[0:v]noise=alls=4:allf=t+u,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]",
  "-map", "[v]", "-map", "1:a", "-t", String(N / FPS),
  "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
  "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-r", String(FPS), "-fps_mode", "cfr",
  "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", OUT,
], { stdio: ["pipe", "inherit", "inherit"] });

for (let f = 0; f < N; f++) {
  await page.evaluate((x) => window.__render(x), f / FPS);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 96 });
  if (!ff.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 60 === 0) process.stdout.write(`${(f / FPS).toFixed(0)}s `);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await b.close();
server.kill();
console.log(`\n✓ ${OUT} (${N} fotogrammi)`);
