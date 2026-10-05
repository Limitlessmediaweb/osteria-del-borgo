"use client";

import { useEffect, useRef, useState } from "react";
import { GALLERY } from "@/lib/content";
import { PHOTOS } from "@/lib/images";
import { Img, srcSet } from "./Img";
import { getLenis } from "@/lib/lenis";

export function Galleria() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      getLenis()?.stop();
    }
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (dir: number) => setIndex((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length));
  const item = index !== null ? GALLERY[index] : null;
  const photo = item ? PHOTOS[item.key] : null;

  return (
    <section id="galleria" aria-labelledby="galleria-title" className="py-24 lg:py-36">
      <div className="wrap">
        <p data-reveal className="eyebrow text-vino">
          Galleria
        </p>
        <h2 id="galleria-title" data-split className="h-section mt-5 max-w-[18ch]">
          La sala, la cucina, la cantina.
        </h2>

        <ul className="mt-14 grid grid-cols-2 gap-3 [grid-auto-flow:dense] sm:gap-4 lg:grid-cols-4 lg:[grid-auto-rows:240px]">
          {GALLERY.map((g, i) => (
            <li
              key={g.key}
              className={`${g.span === "tall" ? "row-span-2" : ""} ${g.span === "wide" ? "col-span-2" : ""} ${
                g.span === "tall" ? "aspect-[3/4] lg:aspect-auto" : g.span === "wide" ? "aspect-[2/1] lg:aspect-auto" : "aspect-square lg:aspect-auto"
              }`}
            >
              <button
                type="button"
                data-clip
                onClick={() => setIndex(i)}
                className="group relative block h-full w-full overflow-hidden rounded-[4px] bg-carta-2"
                aria-label={`Apri la foto: ${g.caption}`}
              >
                <Img photo={g.key} sizes="(min-width:1024px) 25vw, 50vw" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-calm)] group-hover:scale-[1.04]" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-inchiostro/70 to-transparent px-3 pb-3 pt-10 text-left text-[0.8rem] font-medium text-carta opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {g.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        aria-label="Foto della galleria"
        onClose={() => {
          setIndex(null);
          getLenis()?.start();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === dialog.current && setIndex(null)}
        className="m-auto max-h-[92dvh] w-[min(1100px,94vw)] bg-transparent p-0 text-carta"
      >
        {item && photo && (
          <figure className="flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/${photo.file}-1200.webp`} srcSet={srcSet(photo.file)} sizes="94vw" width={photo.w} height={photo.h} alt={photo.alt} className="max-h-[78dvh] w-full rounded-[4px] object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span>{item.caption}</span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="btn btn-ghost-light !min-h-[44px] !px-4" aria-label="Foto precedente">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} className="btn btn-ghost-light !min-h-[44px] !px-4" aria-label="Foto successiva">
                  →
                </button>
                <button type="button" onClick={() => setIndex(null)} className="btn btn-ghost-light !min-h-[44px] !px-4">
                  Chiudi
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </section>
  );
}
