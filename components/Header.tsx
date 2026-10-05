"use client";

import { useEffect, useState } from "react";
import { scrollToTarget } from "@/lib/lenis";
import { track } from "@/lib/analytics";
import { getLenis } from "@/lib/lenis";

const NAV = [
  { href: "#storia", label: "La storia" },
  { href: "#menu", label: "Menù" },
  { href: "#galleria", label: "Galleria" },
  { href: "#orari", label: "Orari e dove siamo" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="font-serif text-[1.45rem] tracking-[-0.01em]">Osteria del Borgo</span>
      <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.3em] opacity-75">Oltrepò Pavese · dal 1962</span>
    </span>
  );
}

export function Header({ home = true }: { home?: boolean }) {
  const [solid, setSolid] = useState(!home);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!home) return;
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    if (!home) return;
    e.preventDefault();
    setOpen(false);
    scrollToTarget(href);
  };

  const light = !solid && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        light ? "bg-transparent text-carta" : "bg-carta/95 text-inchiostro shadow-[0_1px_0_rgb(30_25_21/0.1)] backdrop-blur-md"
      }`}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
        <a href={home ? "#top" : "/"} onClick={(e) => go(e, "#top")} aria-label="Osteria del Borgo, torna all'inizio">
          <Wordmark />
        </a>

        <nav aria-label="Principale" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={home ? n.href : `/${n.href}`} onClick={(e) => go(e, n.href)} className="text-[0.92rem] font-medium opacity-85 transition-opacity hover:opacity-100">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={home ? "#prenota" : "/#prenota"}
            onClick={(e) => {
              track("cta_click", { location: "header" });
              go(e, "#prenota");
            }}
            className="btn btn-vino !min-h-[42px] !px-4 text-[0.88rem] sm:!px-5"
          >
            Prenota
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto bg-carta px-[var(--gutter)] pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[...NAV, { href: "#prenota", label: "Prenota un tavolo" }].map((n) => (
            <a key={n.href} href={home ? n.href : `/${n.href}`} onClick={(e) => go(e, n.href)} className="border-b border-inchiostro/10 py-4 font-serif text-3xl">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
