"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, REDUCED } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Motore delle animazioni di pagina: Lenis + ScrollTrigger e tre comportamenti dichiarativi.
 *  - [data-reveal]  fade + salita di 24px
 *  - [data-clip]    l'immagine si scopre dal basso (clip-path), con un leggero zoom-out
 *  - [data-split]   titoli riga per riga (SplitText)
 *  - [data-parallax="0.15"] parallasse verticale leggera
 * Con prefers-reduced-motion tutto è subito visibile.
 */
export function Motion() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduced = window.matchMedia(REDUCED).matches;
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useGSAP(() => {
    root.current = document.body;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.closest("[data-hero]")) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay: Number(el.dataset.delay || 0),
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 96%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power3.inOut" });
        if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
      });

      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (el.closest("[data-hero]")) return;
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(el, { visibility: "visible" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 0.12);
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
    });

    mm.add(REDUCED, () => {
      gsap.set("[data-reveal], [data-split]", { autoAlpha: 1, visibility: "visible" });
      gsap.set("[data-clip]", { clipPath: "none" });
    });

    return () => mm.revert();
  });

  return null;
}
