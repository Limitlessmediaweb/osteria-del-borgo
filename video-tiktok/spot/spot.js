// Spot "da zero a online" — Osteria del Borgo. Timeline GSAP in pausa: window.__render(t) porta tutto all'istante t.
/* global gsap */
(async () => {
  try {
    const DUR = 24.6;
    const CLIP_FROM = 96; // fotogramma della clip di scroll che corrisponde all'hero già rivelato
    const SCROLL_IN = 7.4; // inizio della scena di scroll
    const CLIP_OFFSET = SCROLL_IN - CLIP_FROM / 60; // tempo spot = tempo clip + offset
    const K = 620 / 390; // px css del sito → px del video (schermo del telefono)
    const $ = (s) => document.querySelector(s);
    const pad = (n) => String(n).padStart(5, "0");

    const meta = await (await fetch("../clips/scroll/meta.json")).json();

    // ---------- codice dell'editor (righe vere di components/Hero.tsx) ----------
    const LINES = [
      [["t-tag", "<section"], ["t-attr", " data-hero"], ["t-attr", " className="], ["t-str", '"min-h-[100svh]"'], ["t-tag", ">"]],
      [["", "  "], ["t-tag", "<h1"], ["t-attr", " className="], ["t-str", '"display"'], ["t-tag", ">"]],
      [["t-txt", "    La cucina dell’Oltrepò,"]],
      [["t-txt", "    come a casa."]],
      [["", "  "], ["t-tag", "</h1>"]],
      [["", "  "], ["t-tag", "<a"], ["t-attr", " href="], ["t-str", '"#prenota"'], ["t-attr", " className="], ["t-str", '"btn-vino"'], ["t-tag", ">"]],
      [["t-txt", "    Prenota un tavolo"]],
      [["", "  "], ["t-tag", "</a>"]],
      [["t-tag", "</section>"]],
    ];
    const TOTAL = LINES.reduce((a, l) => a + l.reduce((b, s) => b + s[1].length, 0), 0);
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    function drawCode(n, caretOn) {
      let left = n;
      let html = "";
      for (let i = 0; i < LINES.length; i++) {
        if (left <= 0 && i > 0) break;
        let line = "";
        for (const [cls, txt] of LINES[i]) {
          const part = txt.slice(0, Math.max(0, left));
          left -= txt.length;
          if (part) line += `<span class="${cls}">${esc(part)}</span>`;
        }
        const last = left <= 0 || i === LINES.length - 1;
        html += `<span class="ln">${i + 1}</span>${line}${last ? `<span id="caret" style="opacity:${caretOn ? 1 : 0}"></span>` : ""}\n`;
        if (last) break;
      }
      $("#code").innerHTML = html;
    }

    // ---------- tabelle e notifiche ----------
    for (let i = 0; i < 14; i++) $("#tables").appendChild(document.createElement("b"));
    const NOTIFS = [
      [4, "20:30"], [2, "21:00"], [6, "20:00"], [3, "21:15"], [5, "19:45"], [2, "20:45"], [4, "21:30"], [8, "20:15"],
    ];
    const N0 = 18.7, NSTEP = 0.26, ROW = 140, START_TABLES = 6;
    const notifEls = NOTIFS.map(([p, h]) => {
      const el = document.createElement("div");
      el.className = "notif";
      el.innerHTML = `<img src="icon.svg" alt=""><div class="tx"><div class="hd">OSTERIA DEL BORGO<span>ora</span></div><div class="ti">Nuova prenotazione</div><div class="bd">${p} persone · sabato ${h}</div></div>`;
      $("#notifs").appendChild(el);
      return el;
    });

    // ---------- tocchi (dalle coordinate reali registrate in meta.json) ----------
    const taps = meta.events.filter((e) => e.tap).map((e) => {
      const el = document.createElement("div");
      el.className = "tap";
      el.style.left = `${e.tap.x * K}px`;
      el.style.top = `${56 + e.tap.y * K}px`;
      $("#screen").appendChild(el);
      return { el, t: e.t + CLIP_OFFSET };
    });

    // ---------- campione colore per la status bar ----------
    const cv = document.createElement("canvas");
    cv.width = 8;
    cv.height = 2;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    function topColor(img) {
      if (!img.naturalWidth) return [255, 255, 255];
      cx.drawImage(img, 0, 0, img.naturalWidth, 6, 0, 0, 8, 2);
      const d = cx.getImageData(0, 0, 8, 2).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      return [r / n, g / n, b / n];
    }
    function setStatus(rgb, forceLight) {
      const [r, g, b] = rgb;
      $("#status").style.background = forceLight ? "transparent" : `rgb(${r | 0},${g | 0},${b | 0})`;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      $("#status").style.color = forceLight || lum < 140 ? "#fff" : "#111";
    }

    // ---------- timeline ----------
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    const sq = gsap.utils.selector(document);

    // stato iniziale
    gsap.set("#sign", { autoAlpha: 0 });
    gsap.set("#hook .mask > span", { yPercent: 110 });
    gsap.set("#phone", { y: 1000, autoAlpha: 0 });
    gsap.set(["#steps", "#cap1", "#cap2", "#cap3", "#online-title", "#url", "#serp", "#mapc", "#count"], { autoAlpha: 0 });
    gsap.set([".cap .mask > span", "#online-title .mask > span", "#cta .mask > span"], { yPercent: 110 });
    gsap.set(["#st-foto", "#st-testi", "#st-colori"], { clipPath: "inset(0px 0px 2480px 0px)" });
    gsap.set("#live", { autoAlpha: 0, scale: 0.9 });
    gsap.set("#serp .res, #serp .tabs", { autoAlpha: 0 });
    gsap.set("#serp .rank", { autoAlpha: 0, x: 20 });
    gsap.set("#pin", { y: -160, autoAlpha: 0 });
    gsap.set("#pinshadow", { autoAlpha: 0, scale: 0.4 });
    gsap.set("#placecard", { autoAlpha: 0, y: 30 });
    gsap.set("#full", { autoAlpha: 0, x: -16 });
    gsap.set(notifEls, { autoAlpha: 0, y: -50, scale: 0.97 });
    gsap.set(["#cta .dm", "#cta .note", "#cta .eyebrow"], { autoAlpha: 0, y: 24 });

    // 1. HOOK (0–2,4)
    tl.to("#sign", { autoAlpha: 1, duration: 0.6 }, 0.3);
    tl.to("#hook .mask > span", { yPercent: 0, duration: 0.8, stagger: 0.15 }, 0.05);
    tl.to("#hook em", { color: "#c39a5c", duration: 0.01 }, 0);
    

    // 2. COSTRUZIONE (2,4–7,4)
    tl.to("#hook .mask > span", { yPercent: -110, duration: 0.6, stagger: 0.06, ease: "power3.in" }, 2.3);
    tl.to("#editor", { y: 260, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 2.3);
    tl.to("#phone", { y: 0, autoAlpha: 1, duration: 1.0, ease: "power3.out" }, 2.55);
    tl.to("#steps", { autoAlpha: 1, duration: 0.5 }, 2.9);
    const steps = sq(".step");
    const fills = sq(".step .fill");
    const wipe = (img, at, dur) => {
      const o = { y: 0 };
      tl.to(o, {
        y: 1342,
        duration: dur,
        ease: "power2.inOut",
        onUpdate: () => {
          gsap.set(img, { clipPath: `inset(0px 0px ${2480 - o.y}px 0px)` });
          gsap.set("#scan", { top: o.y - 1, autoAlpha: o.y > 2 && o.y < 1340 ? 1 : 0 });
        },
      }, at);
      tl.set(img, { clipPath: "none" }, at + dur + 0.001);
    };
    tl.set(steps[0], { className: "step on" }, 3.0);
    tl.to(fills[0], { scaleX: 1, duration: 0.6, ease: "power1.inOut" }, 3.0);
    tl.set(steps[1], { className: "step on" }, 3.6);
    wipe("#st-foto", 3.6, 0.75);
    tl.to(fills[1], { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 3.6);
    tl.set(steps[2], { className: "step on" }, 4.75);
    wipe("#st-testi", 4.75, 0.75);
    tl.to(fills[2], { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 4.75);
    tl.set(steps[3], { className: "step on" }, 5.9);
    wipe("#st-colori", 5.9, 0.75);
    tl.to(fills[3], { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 5.9);
    tl.to("#steps", { autoAlpha: 0, y: -14, duration: 0.45, ease: "power2.in" }, 7.0);

    // 3. SCROLL VERO NEL TELEFONO (7,4–15,4)
    tl.set("#clip", { opacity: 1 }, SCROLL_IN);
    const cap = (id, a, b) => {
      tl.to(`${id}`, { autoAlpha: 1, duration: 0.01 }, a);
      tl.fromTo(`${id} .mask > span`, { yPercent: 110 }, { yPercent: 0, duration: 0.75 }, a);
      tl.to(`${id} .mask > span`, { yPercent: -110, duration: 0.45, ease: "power3.in" }, b - 0.45);
      tl.set(`${id}`, { autoAlpha: 0 }, b);
    };
    cap("#cap1", 7.65, 10.0);
    cap("#cap2", 10.25, 12.45);
    cap("#cap3", 12.65, 15.3);
    tl.to("#phone", { scale: 1.045, duration: 1.6, ease: "power2.inOut" }, 13.4);
    taps.forEach(({ el, t }) => {
      tl.fromTo(el, { autoAlpha: 0.95, scale: 0.55 }, { autoAlpha: 0, scale: 1.25, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
    });

    // 4. ONLINE (15,4–18,4)
    tl.to("#phone", { scale: 0.9, autoAlpha: 0.22, filter: "blur(8px)", duration: 0.6, ease: "power2.inOut" }, 15.35);
    tl.to("#online-title", { autoAlpha: 1, duration: 0.01 }, 15.45);
    tl.to("#online-title .mask > span", { yPercent: 0, duration: 0.8 }, 15.45);
    tl.fromTo("#url", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 15.6);
    const typeTo = (sel, text, at, dur, html) => {
      const o = { n: 0 };
      tl.to(o, { n: text.length, duration: dur, ease: "none", onUpdate: () => { $(sel).innerHTML = html ? html(Math.round(o.n)) : esc(text.slice(0, Math.round(o.n))); } }, at);
    };
    $("#addr").textContent = "";
    $("#query").textContent = "";
    const DOMAIN = "osteriadelborgo.it";
    typeTo("#addr", DOMAIN, 15.75, 0.6, (n) => {
      const s = DOMAIN.slice(0, n);
      const i = s.indexOf(".it");
      return i >= 0 ? `${esc(s.slice(0, i))}<span>${esc(s.slice(i))}</span>` : esc(s);
    });
    tl.to("#live", { autoAlpha: 1, scale: 1, duration: 0.4 }, 16.4);
    tl.fromTo("#serp", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 16.45);
    typeTo("#query", "trattoria oltrepò pavese", 16.6, 0.45);
    tl.to("#serp .tabs", { autoAlpha: 1, duration: 0.3 }, 16.95);
    tl.fromTo("#serp .res", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 17.05);
    tl.to("#serp .rank", { autoAlpha: 1, x: 0, duration: 0.4 }, 17.3);
    tl.fromTo("#mapc", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 17.2);
    tl.to("#pin", { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 17.45);
    tl.to("#pinshadow", { autoAlpha: 1, scale: 1, duration: 0.45 }, 17.45);
    tl.to("#placecard", { autoAlpha: 1, y: 0, duration: 0.5 }, 17.65);
    tl.to(["#online-title", "#url", "#serp", "#mapc"], { autoAlpha: 0, y: -40, duration: 0.35, stagger: 0.03, ease: "power2.in" }, 17.95);

    // 5. RISULTATO (18,4–21,6)
    tl.set("#lock", { opacity: 1 }, 18.38);
    tl.to("#phone", { scale: 1, y: 140, autoAlpha: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 18.38);
    tl.fromTo("#count", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 18.4);
    notifEls.forEach((el, i) => {
      const at = N0 + i * NSTEP;
      tl.to(el, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42 }, at);
      for (let j = 0; j < i; j++) {
        const k = i - j; // posizione della notifica j dopo l'arrivo della i
        tl.to(notifEls[j], { y: k * ROW, autoAlpha: k > 3 ? 0 : 1, duration: 0.42 }, at);
      }
    });
    const FULL_AT = N0 + (NOTIFS.length - 1) * NSTEP + 0.25;
    tl.to("#full", { autoAlpha: 1, x: 0, duration: 0.5 }, FULL_AT);

    // 6. CTA (21,6–24,6)
    tl.to("#cta", { opacity: 1, duration: 0.55, ease: "power2.inOut" }, 21.6);
    tl.fromTo("#cta .bgimg", { scale: 1.1 }, { scale: 1, duration: 3.2, ease: "power1.out" }, 21.6);
    tl.to("#cta .eyebrow", { autoAlpha: 1, y: 0, duration: 0.6 }, 21.85);
    tl.to("#cta .mask > span", { yPercent: 0, duration: 0.9, stagger: 0.14 }, 21.95);
    tl.to("#cta .dm", { autoAlpha: 1, y: 0, duration: 0.6 }, 22.7);
    tl.to("#cta .note", { autoAlpha: 1, y: 0, duration: 0.6 }, 23.0);
    tl.to({}, { duration: 0.01 }, DUR);

    // ---------- render di un istante ----------
    const stageImgs = ["#st-wire", "#st-foto", "#st-testi", "#st-colori"].map((s) => $(s));
    const wipeStarts = [0, 3.6, 4.75, 5.9];
    const clipImg = $("#clip");
    let lastClip = -1;

    window.__render = async (t) => {
      tl.seek(t, false);
      // codice che si scrive
      const typed = Math.round(gsap.utils.clamp(0, 1, (t - 0.55) / 1.7) * TOTAL);
      drawCode(typed, Math.floor(t * 2.2) % 2 === 0 || (t > 0.55 && t < 2.25));
      // clip dello scroll
      const pending = [];
      if (t >= SCROLL_IN) {
        const f = Math.min(meta.frames - 1, Math.max(0, Math.round((t - CLIP_OFFSET) * 60)));
        if (f !== lastClip) {
          clipImg.src = `../clips/scroll/frames/${pad(f)}.jpg`;
          pending.push(clipImg.decode().catch(() => {}));
          lastClip = f;
        }
      }
      await Promise.all(pending);
      // status bar
      if (t >= 18.38) {
        setStatus([0, 0, 0], true);
        $("#clocktxt").style.visibility = "hidden";
      } else {
        $("#clocktxt").style.visibility = "visible";
        let src = stageImgs[0];
        for (let i = 3; i >= 0; i--) if (t >= wipeStarts[i] + 0.05) { src = stageImgs[i]; break; }
        setStatus(topColor(t >= SCROLL_IN ? clipImg : src));
      }
      // contatore tavoli
      const arrived = NOTIFS.filter((_, i) => t >= N0 + i * NSTEP + 0.12).length;
      const n = t < 18.4 ? START_TABLES : START_TABLES + arrived;
      $("#n").textContent = String(n);
      $("#tables").querySelectorAll("b").forEach((b, i) => b.classList.toggle("on", i < n));
      return true;
    };

    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {}))));
    await window.__render(0);
    window.__ready = true;
    window.__DUR = DUR;
  } catch (e) {
    window.__error = String(e && e.stack ? e.stack : e);
  }
})();
