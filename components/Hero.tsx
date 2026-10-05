"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { srcSet } from "./Img";
import { PHOTOS } from "@/lib/images";
import { WEEK } from "@/lib/content";

function todayStatus(now = new Date()) {
  const day = WEEK[now.getDay()];
  if (!day.slots.length) return `Oggi siamo chiusi · ${day.day} riposo`;
  return `Oggi ${day.slots.map((s) => `${s.from}–${s.to}`).join(" · ")}`;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => setStatus(todayStatus()), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const title = ref.current!.querySelector<HTMLElement>("[data-split]")!;
        const split = SplitText.create(title, { type: "lines", mask: "lines" });
        gsap.set(title, { visibility: "visible" });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo("[data-hero-img]", { scale: 1.12, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, duration: 2.4, ease: "power2.out" }, 0)
          .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.35)
          .fromTo("[data-hero] [data-reveal]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, 0.8);

        gsap.to("[data-hero-img]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const wide = PHOTOS.heroSalaWide;
  const tall = PHOTOS.heroSala;

  return (
    <section ref={ref} id="top" data-hero className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-inchiostro text-carta">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <picture>
          <source media="(min-width: 900px) and (orientation: landscape)" srcSet={srcSet(wide.file)} sizes="100vw" width={wide.w} height={wide.h} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-hero-img
            src={`/img/${tall.file}-1200.webp`}
            srcSet={srcSet(tall.file)}
            sizes="100vw"
            width={tall.w}
            height={tall.h}
            alt="La sala dell'Osteria del Borgo: muri in pietra, travi in legno e la lunga tavola apparecchiata"
            fetchPriority="high"
            className="h-full w-full origin-center object-cover object-[50%_60%]"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_16_13/0.55)_0%,rgb(20_16_13/0.1)_32%,rgb(20_16_13/0.25)_55%,rgb(20_16_13/0.86)_100%)]" />
      </div>

      <div className="wrap pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-32 lg:pb-20">
        <p data-reveal className="eyebrow mb-5 text-carta/80">
          Trattoria di paese · Oltrepò Pavese
        </p>
        <h1 data-split className="display max-w-[12ch] text-[clamp(3.4rem,2rem+7.5vw,8.6rem)]">
          La cucina dell&rsquo;Oltrepò, come a casa.
        </h1>
        <p data-reveal className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-carta/85 lg:text-lg">
          Risotti, agnolotti tirati a mano, salame di Varzi e vini delle nostre colline. In una sala in pietra con le travi a vista e, d&rsquo;estate, sotto il pergolato.
        </p>
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#prenota"
            onClick={(e) => {
              e.preventDefault();
              track("cta_click", { location: "hero" });
              scrollToTarget("#prenota");
            }}
            className="btn btn-vino"
          >
            Prenota un tavolo
          </a>
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#menu");
            }}
            className="btn btn-ghost-light"
          >
            Guarda il menù
          </a>
        </div>
        <p data-reveal className="mt-8 flex items-center gap-2 text-sm text-carta/75" aria-live="polite">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-oro" aria-hidden="true" />
          <span className="min-h-[1.25rem]">{status ?? "Aperti da martedì a domenica"}</span>
        </p>
      </div>
    </section>
  );
}
