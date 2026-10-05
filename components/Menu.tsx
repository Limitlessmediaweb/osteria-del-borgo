"use client";

import { useRef, useState } from "react";
import { MENU } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { Img } from "./Img";

export function Menu() {
  const [active, setActive] = useState(MENU[1].id);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = MENU.find((c) => c.id === active)!;

  const select = (id: string) => {
    if (id === active) return;
    setActive(id);
    track("menu_tab", { tab: id });
    requestAnimationFrame(() => {
      // l'altezza del pannello cambia: i trigger delle sezioni sotto vanno ricalcolati
      ScrollTrigger.refresh();
      if (!panel.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(panel.current.querySelectorAll("[data-row]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" });
      gsap.fromTo(panel.current.querySelector("[data-menu-img]"), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power2.out" });
    });
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + MENU.length) % MENU.length;
    select(MENU[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-carta-2 py-24 lg:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p data-reveal className="eyebrow text-vino">
              Il menù
            </p>
            <h2 id="menu-title" data-split className="h-section mt-5 max-w-[14ch]">
              Pochi piatti, fatti come si deve.
            </h2>
          </div>
          <p data-reveal className="max-w-[40ch] text-[0.95rem] leading-relaxed text-inchiostro/70">
            Il menù cambia con le stagioni e con quello che porta l&rsquo;orto. Prezzi in euro, coperto 2,50 €.
          </p>
        </div>

        <div role="tablist" aria-label="Sezioni del menù" data-reveal className="-mx-[var(--gutter)] mt-12 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none]">
          {MENU.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={active === c.id}
              aria-controls="menu-panel"
              tabIndex={active === c.id ? 0 : -1}
              onClick={() => select(c.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.92rem] font-medium transition-colors duration-300 ${
                active === c.id ? "border-vino bg-vino text-carta" : "border-inchiostro/20 text-inchiostro/80 hover:border-inchiostro/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div ref={panel} id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div data-menu-img className="aspect-[4/3] overflow-hidden rounded-[4px] lg:sticky lg:top-24 lg:aspect-[3/4]">
              <Img key={cat.photo} photo={cat.photo} sizes="(min-width:1024px) 30vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-inchiostro/10">
              {cat.dishes.map((d) => (
                <li key={d.name} data-row className="py-5 first:pt-0">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-serif text-[1.5rem] leading-tight lg:text-[1.75rem]">{d.name}</h3>
                    {d.tag && <span className="hidden shrink-0 rounded-full bg-oliva/12 px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-oliva sm:inline">{d.tag}</span>}
                    <span className="dots" aria-hidden="true" />
                    <span className="shrink-0 font-serif text-[1.35rem] tabular-nums text-vino">
                      {d.price}
                      <span className="sr-only"> euro</span>
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-[56ch] text-[0.95rem] leading-relaxed text-inchiostro/65">{d.desc}</p>
                </li>
              ))}
            </ul>
            {cat.note && <p className="mt-6 border-l-2 border-oro pl-4 text-sm leading-relaxed text-inchiostro/70">{cat.note}</p>}
            <p className="mt-8 text-xs text-inchiostro/50">Allergeni: chiedete in sala o segnalateli nella prenotazione.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
