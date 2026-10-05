import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Img } from "@/components/Img";

export const metadata: Metadata = { title: "Pagina non trovata" };

export default function NotFound() {
  return (
    <>
      <Header home={false} />
      <main id="contenuto" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-inchiostro text-carta">
        <div className="absolute inset-0 -z-10 opacity-40">
          <Img photo="porta" sizes="100vw" decorative className="h-full w-full object-cover" />
        </div>
        <div className="wrap py-32">
          <p className="eyebrow text-oro">Errore 404</p>
          <h1 className="display mt-5 max-w-[14ch] text-[clamp(3rem,2rem+5vw,6rem)]">Questa porta non porta da nessuna parte.</h1>
          <p className="mt-6 max-w-[42ch] text-carta/80">La pagina che cercavi non c&rsquo;è più, o forse non c&rsquo;è mai stata. In sala, però, il tavolo c&rsquo;è.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/#prenota" className="btn btn-vino">
              Prenota un tavolo
            </a>
            <a href="/#menu" className="btn btn-ghost-light">
              Guarda il menù
            </a>
            <a href="/" className="btn btn-ghost-light">
              Torna alla home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
