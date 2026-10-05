"use client";

import { useState } from "react";
import { FAQ } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-carta-2 py-24 lg:py-32">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow text-vino">
            Domande frequenti
          </p>
          <h2 id="faq-title" data-split className="h-section mt-5">
            Prima di venire.
          </h2>
        </div>
        <ul className="divide-y divide-inchiostro/12 border-y border-inchiostro/12 lg:col-span-8">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-b-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-p-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.35rem] leading-snug lg:text-[1.55rem]"
                  >
                    {f.q}
                    <span aria-hidden="true" className={`relative h-4 w-4 shrink-0 transition-transform duration-500 ease-[var(--ease-calm)] ${isOpen ? "rotate-45" : ""}`}>
                      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px bg-current" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-calm)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[62ch] pb-6 leading-relaxed text-inchiostro/72">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
