"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Scroll morbido verso un'ancora, con fallback nativo. Tiene conto dell'header fisso. */
export function scrollToTarget(target: string) {
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;
  if (instance) instance.scrollTo(el, { duration: 1.4, offset: -64 });
  else el.scrollIntoView({ behavior: "smooth" });
}
